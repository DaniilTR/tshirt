#!/usr/bin/env python3
"""
Генерация тестовых логов запросов в таблицу query_logs.
Загружает конфиг из backend/.env или .env в корне проекта.
"""
import os
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv
import mysql.connector

# Попробуем загрузить backend/.env, если есть, иначе .env
if os.path.exists('backend/.env'):
    load_dotenv('backend/.env')
else:
    load_dotenv()

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', '')

conn = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME,
    autocommit=False
)
cursor = conn.cursor()

normal_queries = [
    "SELECT * FROM products WHERE category = 'Electronics'",
    "SELECT * FROM users WHERE user_id = 1",
    "INSERT INTO orders (user_id, total_amount) VALUES (2, 100.00)",
    "UPDATE products SET stock_quantity = 50 WHERE product_id = 1",
    "SELECT COUNT(*) FROM orders WHERE status = 'delivered'",
    "SELECT * FROM products ORDER BY price DESC LIMIT 10"
]

anomalous_queries = [
    "SELECT * FROM users WHERE '1'='1' OR username = 'admin'",
    "SELECT * FROM users; DROP TABLE users; --",
    "SELECT * FROM users WHERE user_id = 1 UNION SELECT * FROM admin_table",
    "SELECT password_hash FROM users WHERE 1=1",
    "UPDATE users SET role = 'admin' WHERE user_id = 999",
    "SELECT * FROM users WHERE username = 'admin' AND password = '' OR '1'='1'"
]

def ensure_table_exists():
    cursor.execute("""
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = %s AND table_name = 'query_logs'
    """, (DB_NAME,))
    if cursor.fetchone()[0] == 0:
        print("Таблица query_logs не найдена. Создаю её из create_query_logs.sql (если она есть)...")
        # Попробуем выполнить SQL создания таблицы встроенного варианта
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS query_logs (
            query_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            query_text TEXT,
            query_duration_ms INT,
            rows_affected INT,
            is_suspicious TINYINT(1) DEFAULT 0,
            anomaly_score FLOAT DEFAULT 0,
            execution_time DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        conn.commit()
        print("Таблица создана.")

def generate(n=1000):
    print(f"Генерация {n} строк логов...")
    for i in range(n):
        if random.random() < 0.9:
            query = random.choice(normal_queries)
            is_suspicious = 0
            anomaly_score = round(random.uniform(0, 0.3), 3)
        else:
            query = random.choice(anomalous_queries)
            is_suspicious = 1
            anomaly_score = round(random.uniform(0.7, 1.0), 3)

        user_id = random.randint(1, 10)
        duration = random.randint(10, 500)
        rows_affected = random.randint(0, 100)

        cursor.execute("""
            INSERT INTO query_logs 
            (user_id, query_text, query_duration_ms, rows_affected, is_suspicious, anomaly_score, execution_time)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
        """, (user_id, query, duration, rows_affected, is_suspicious, anomaly_score))

        if i % 200 == 0 and i > 0:
            conn.commit()

    conn.commit()
    print("Генерация завершена.")

if __name__ == "__main__":
    ensure_table_exists()
    generate(1000)
    cursor.close()
    conn.close()