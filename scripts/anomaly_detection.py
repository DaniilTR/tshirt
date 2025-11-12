#!/usr/bin/env python3
"""
Скрипт для обучения модели обнаружения аномалий и сохранения её на диск.
Используем scikit-learn RandomForest и IsolationForest + опционально сохраняем NN (Keras).
"""
import os
from dotenv import load_dotenv
import mysql.connector
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# Загрузка .env
if os.path.exists('backend/.env'):
    load_dotenv('backend/.env')
else:
    load_dotenv()

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', '')
DB_PORT = int(os.getenv('DB_PORT', '3306'))

conn = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME,
    port=DB_PORT
)
cursor = conn.cursor(dictionary=True)

# Попробуйте получить разметку (is_suspicious) и признаки
cursor.execute("""
SELECT 
    query_id,
    user_id,
    CHAR_LENGTH(query_text) as query_length,
    query_duration_ms,
    rows_affected,
    is_suspicious,
    (CASE WHEN query_text LIKE '%DROP%' OR query_text LIKE '%DELETE%' THEN 1 ELSE 0 END) as has_dangerous_keyword,
    (CASE WHEN query_text LIKE '%UNION%' OR query_text LIKE '%OR%1%=%1%' OR query_text LIKE '%--%' THEN 1 ELSE 0 END) as has_injection_pattern
FROM query_logs
WHERE query_text IS NOT NULL
""")

rows = cursor.fetchall()
df = pd.DataFrame(rows)

if df.empty:
    print("Нет данных для обучения — заполните таблицу query_logs (например generate_logs.py).")
    cursor.close()
    conn.close()
    raise SystemExit(1)

# Подготовка признаков и метки
features = ['user_id', 'query_length', 'query_duration_ms', 'rows_affected', 'has_dangerous_keyword', 'has_injection_pattern']
for f in features:
    if f not in df.columns:
        df[f] = 0

X = df[features].fillna(0).values
y = df['is_suspicious'].fillna(0).astype(int).values

# Масштабирование
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Сохранить scaler
os.makedirs('models', exist_ok=True)
joblib.dump(scaler, 'models/scaler.joblib')

# Разделение
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y if len(np.unique(y))>1 else None)

# Классификатор
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
print("RandomForest classification report:")
print(classification_report(y_test, y_pred))
print("Confusion matrix:")
print(confusion_matrix(y_test, y_pred))

joblib.dump(clf, 'models/rf_anomaly_model.joblib')
print("Модель RandomForest сохранена: models/rf_anomaly_model.joblib")

# Изолирующий лес для выявления аномалий (не требуется меток)
iso = IsolationForest(contamination=0.05, random_state=42)
iso.fit(X_scaled)
joblib.dump(iso, 'models/isolation_forest.joblib')
print("Модель IsolationForest сохранена: models/isolation_forest.joblib")

cursor.close()
conn.close()