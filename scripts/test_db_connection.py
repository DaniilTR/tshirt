#!/usr/bin/env python3
"""
Быстрая проверка подключения к MySQL на основе переменных окружения из backend/.env или .env.
И выведет текущую базу и версию сервера.
"""
import os
from dotenv import load_dotenv
import mysql.connector

if os.path.exists('backend/.env'):
    load_dotenv('backend/.env')
else:
    load_dotenv()

DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_PORT = int(os.getenv('DB_PORT', '3306'))
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', '')

print(f"Пробую подключиться: host={DB_HOST} port={DB_PORT} user={DB_USER} db={DB_NAME}")

try:
    conn = mysql.connector.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        connection_timeout=5
    )
    cur = conn.cursor()
    cur.execute("SELECT DATABASE(), VERSION()")
    db, ver = cur.fetchone()
    print(f"✅ Соединение установлено. DB={db}, MySQL version={ver}")
    cur.close()
    conn.close()
except Exception as e:
    print("❌ Подключение не удалось:", e)
    print("Подсказка: проверьте, что служба MySQL запущена, порт и креды верные, и .env загружен.")
