#!/usr/bin/env python3
"""
Main orchestrator для Python-скриптов проекта.
Запускается в контейнере `scripts` и последовательно:
 1) ожидает доступность MySQL
 2) выполняет generate_logs.py
 3) обучает модели anomaly_detection.py
 4) обновляет метрики update_anomaly_scores.py
 5) запускает короткий мониторинг monitoring_system.py (2 итерации, чтобы не висеть бесконечно)
Логи транслируются в stdout контейнера (docker compose logs -f scripts)
"""
import os
import sys
import time
import subprocess

import mysql.connector

DB_HOST = os.getenv('DB_HOST', 'db')
DB_PORT = int(os.getenv('DB_PORT', '3306'))
DB_USER = os.getenv('DB_USER', 'tshirt_user')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'TshirtPass123!')
DB_NAME = os.getenv('DB_NAME', 'tshirtbd')


def wait_for_mysql(timeout=60):
    start = time.time()
    while time.time() - start < timeout:
        try:
            conn = mysql.connector.connect(
                host=DB_HOST,
                port=DB_PORT,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME,
                connection_timeout=5,
            )
            conn.close()
            print(f"✅ MySQL доступен: host={DB_HOST} port={DB_PORT}")
            return True
        except Exception as e:
            print(f"⏳ Жду MySQL... ({e})")
            time.sleep(3)
    print("❌ Не дождался MySQL")
    return False


def run_script(script, *args):
    cmd = [sys.executable, script, *args]
    print(f"\n==== ▶ Запуск: {' '.join(cmd)}")
    proc = subprocess.run(cmd, cwd='/app', check=False)
    print(f"==== ⏹ Завершено с кодом {proc.returncode}\n")
    return proc.returncode


def main():
    print("Orchestrator started")
    print(f"ENV: DB_HOST={DB_HOST} DB_PORT={DB_PORT} DB_USER={DB_USER} DB_NAME={DB_NAME}")

    if not wait_for_mysql():
        sys.exit(1)

    # 1) Генерация логов
    run_script('scripts/generate_logs.py')

    # 2) Обучение моделей
    run_script('scripts/anomaly_detection.py')

    # 3) Обновление аномальных метрик
    run_script('scripts/update_anomaly_scores.py')

    # 4) Мониторинг (2 итерации по 5 сек)
    # monitoring_system.py по умолчанию делает 5 итераций. Добавим параметры через env? Легче через python -c
    # Но проще слегка поправить скрипт на чтение ENV, пока оставим как есть и пусть отработает по умолчанию 1-2 итерации.
    # Запустим на 2 итерации через переменную окружения MON_ITERATIONS
    iterations = os.getenv('MON_ITERATIONS', '2')
    try:
        iters = int(iterations)
    except ValueError:
        iters = 2

    # Вызовем monitoring_system как модуль с переопределением аргументов через -c
    code = f"""
import os, time
from scripts.monitoring_system import main
main(iterations={iters}, pause=5)
"""
    print("\n==== ▶ Запуск мониторинга (короткий прогон)")
    proc = subprocess.run([sys.executable, '-c', code], cwd='/app', check=False)
    print(f"==== ⏹ Мониторинг завершен с кодом {proc.returncode}\n")

    print("🎉 Orchestrator finished")


if __name__ == '__main__':
    main()
