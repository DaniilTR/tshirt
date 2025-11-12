#!/usr/bin/env python3
"""
Загружает обученную модель и обновляет anomaly_score и is_suspicious для новых запросов.
"""
import os
from dotenv import load_dotenv
import mysql.connector
import numpy as np
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

# Загрузка моделей и scaler
scaler_path = 'models/scaler.joblib'
model_path = 'models/rf_anomaly_model.joblib'
iso_path = 'models/isolation_forest.joblib'

if not (os.path.exists(model_path) and os.path.exists(scaler_path)):
    print("Модель или scaler не найдены. Сначала выполните anomaly_detection.py")
    raise SystemExit(1)

scaler = joblib.load(scaler_path)
clf = joblib.load(model_path)
iso = joblib.load(iso_path) if os.path.exists(iso_path) else None

conn = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME,
    port=DB_PORT,
    autocommit=False
)
cursor = conn.cursor(dictionary=True)

# Выбрать новые записи без оценки (anomaly_score = 0 или NULL)
cursor.execute("""
SELECT 
    query_id,
    user_id,
    CHAR_LENGTH(query_text) as query_length,
    query_duration_ms,
    rows_affected,
    query_text
FROM query_logs
WHERE anomaly_score = 0 OR anomaly_score IS NULL
LIMIT 500
""")
rows = cursor.fetchall()

if not rows:
    print("Нет новых запросов для обновления.")
else:
    X = []
    ids = []
    for r in rows:
        ids.append(r['query_id'])
        has_dangerous = 1 if ('DROP' in (r['query_text'] or '').upper() or 'DELETE' in (r['query_text'] or '').upper()) else 0
        has_injection = 1 if ('UNION' in (r['query_text'] or '').upper() or "--" in (r['query_text'] or '')) else 0
        X.append([
            r['user_id'] or 0,
            r['query_length'] or 0,
            r['query_duration_ms'] or 0,
            r['rows_affected'] or 0,
            has_dangerous,
            has_injection
        ])
    X = np.array(X)
    X_scaled = scaler.transform(X)

    # Используем среднюю из нескольких моделей: clf.predict_proba и iso score
    probs = clf.predict_proba(X_scaled)[:, 1]  # вероятность "is_suspicious"
    iso_scores = iso.decision_function(X_scaled) if iso is not None else None

    updates = []
    for i, qid in enumerate(ids):
        base_score = float(probs[i])
        if iso_scores is not None:
            # decision_function: высокие значения = нормальные, низкие = аномалии -> инвертируем в 0..1
            iso_score = float(-iso_scores[i])
            # нормализуем iso_score приближенно
            iso_score_norm = 1.0 / (1.0 + np.exp(-iso_score/10.0))
            final_score = min(1.0, 0.6*base_score + 0.4*iso_score_norm)
        else:
            final_score = base_score
        is_susp = 1 if final_score > 0.5 else 0
        updates.append((final_score, is_susp, qid))

    for score, is_susp, qid in updates:
        cursor.execute("""
            UPDATE query_logs
            SET anomaly_score = %s, is_suspicious = %s
            WHERE query_id = %s
        """, (float(score), int(is_susp), int(qid)))

    conn.commit()
    print(f"Обновлено {len(updates)} записей.")

cursor.close()
conn.close()