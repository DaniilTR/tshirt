#!/usr/bin/env python3
"""
Простой мониторинг метрик MySQL и анализ паттернов запросов.
Запускается интерактивно или по крону/демону.
"""
import os
import time
from dotenv import load_dotenv
import mysql.connector
from datetime import datetime

if os.path.exists('backend/.env'):
    load_dotenv('backend/.env')
else:
    load_dotenv()

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', '')

def get_database_metrics(conn):
    cursor = conn.cursor(dictionary=True)
    metrics = {}
    cursor.execute("SHOW STATUS LIKE 'Threads_connected'")
    metrics['active_connections'] = int(cursor.fetchone()['Value'])
    cursor.execute("SHOW STATUS LIKE 'Questions'")
    metrics['total_queries'] = int(cursor.fetchone()['Value'])
    cursor.execute("SHOW STATUS LIKE 'Slow_queries'")
    metrics['slow_queries'] = int(cursor.fetchone()['Value'])
    cursor.execute("SHOW STATUS LIKE 'Uptime'")
    metrics['uptime'] = int(cursor.fetchone()['Value'])
    cursor.execute("""
        SELECT SUM(data_length + index_length) / 1024 / 1024 AS size_mb
        FROM information_schema.tables
        WHERE table_schema = %s
    """, (DB_NAME,))
    res = cursor.fetchone()
    metrics['database_size_mb'] = float(res['size_mb'] or 0) if res else 0.0
    cursor.close()
    return metrics

def analyze_query_patterns(conn):
    cursor = conn.cursor(dictionary=True)
    # Обратите внимание: в вашей БД может отличаться имя столбца с временем выполнения (execution_time / created_at)
    query = """
    SELECT 
        COUNT(*) as total_queries,
        AVG(query_duration_ms) as avg_duration,
        MAX(query_duration_ms) as max_duration,
        SUM(CASE WHEN is_suspicious = 1 THEN 1 ELSE 0 END) as suspicious_count,
        AVG(anomaly_score) as avg_anomaly_score
    FROM query_logs
    WHERE execution_time >= NOW() - INTERVAL 1 HOUR
    """
    try:
        cursor.execute(query)
        result = cursor.fetchone()
    except Exception as e:
        print("Ошибка при выполнении запроса анализа паттернов:", e)
        result = {'total_queries': 0, 'avg_duration': None, 'max_duration': None, 'suspicious_count': 0, 'avg_anomaly_score': None}
    cursor.close()
    return result

def detect_anomalies(current_metrics, historical_avg):
    anomalies = []
    if current_metrics['active_connections'] > historical_avg['connections'] * 1.5:
        anomalies.append({'type':'HIGH_CONNECTIONS','severity':'WARNING','message':f"Высокое количество соединений: {current_metrics['active_connections']}"})
    if current_metrics['slow_queries'] > historical_avg['slow_queries'] * 2:
        anomalies.append({'type':'SLOW_QUERIES','severity':'WARNING','message':f"Увеличение медленных запросов: {current_metrics['slow_queries']}"})
    return anomalies

def main(iterations=5, pause=10):
    conn = mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
    historical_avg = {'connections': 10, 'slow_queries': 5}
    for i in range(iterations):
        print("="*60)
        print(f"Проверка #{i+1} - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        metrics = get_database_metrics(conn)
        query_stats = analyze_query_patterns(conn)
        print("\n📊 МЕТРИКИ БД:")
        print(f"  Активные соединения: {metrics['active_connections']}")
        print(f"  Всего запросов: {metrics['total_queries']}")
        print(f"  Медленные запросы: {metrics['slow_queries']}")
        print(f"  Размер БД: {metrics['database_size_mb']:.2f} MB")
        print("\n🔍 АНАЛИЗ ЗАПРОСОВ (последний час):")
        if query_stats and query_stats['total_queries']:
            print(f"  Всего запросов: {query_stats['total_queries']}")
            print(f"  Средняя длительность: {query_stats['avg_duration']}")
            print(f"  Максимальная длительность: {query_stats['max_duration']}")
            print(f"  Подозрительных запросов: {query_stats['suspicious_count']}")
            print(f"  Средний балл аномалии: {query_stats['avg_anomaly_score']}")
        else:
            print("  Нет данных за последний час или ошибка чтения.")
        anomalies = detect_anomalies(metrics, historical_avg)
        if anomalies:
            print("\n⚠️  ОБНАРУЖЕНЫ АНОМАЛИИ:")
            for a in anomalies:
                print(f"  [{a['severity']}] {a['message']}")
        else:
            print("\n✅ Аномалий не обнаружено")
        time.sleep(pause)
    conn.close()

if __name__ == "__main__":
    main()