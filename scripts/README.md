# Скрипты аналитики и мониторинга

В этой папке находятся Python-скрипты, которые работают с MySQL:
- `generate_logs.py` — создаёт тестовые записи в таблице `query_logs` (создаёт таблицу, если нет)
- `anomaly_detection.py` — обучает модели (RandomForest, IsolationForest) и сохраняет в `models/`
- `update_anomaly_scores.py` — обновляет `anomaly_score` и `is_suspicious` для новых записей
- `monitoring_system.py` — выводит метрики MySQL и простые аномалии по порогам
- `main.py` — оркестратор, который запускает всё по порядку внутри контейнера `scripts`
- `test_db_connection.py` — быстрая проверка подключения к БД (локально)

## Запуск в Docker (рекомендовано)

Контейнер `scripts` собирается из `scripts/Dockerfile` и запускается через docker compose.
Он монтирует весь проект в `/app`, чтобы скрипты видели `backend/.env` и записывали модели в `models/`.

Старт всех сервисов (БД, бэкенд, фронтенд, скрипты):

```powershell
# из корня репозитория
$env:PATH = "$Env:ProgramFiles\Docker\Docker\resources\bin;" + $env:PATH
docker compose up -d db backend frontend scripts
```

Посмотреть логи оркестратора и скриптов:
```powershell
docker compose logs -f scripts
```

Перезапустить только оркестратор:
```powershell
docker compose restart scripts
```

Запустить отдельный скрипт внутри контейнера:
```powershell
# пример: обновление аномальных метрик
docker compose exec scripts python -u scripts/update_anomaly_scores.py
```

Остановка:
```powershell
docker compose stop scripts
```

Переменные окружения для `scripts` задаются в `docker-compose.yml` (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME).
По умолчанию `DB_HOST=db`, `DB_PORT=3306` — это сетевое имя и порт контейнера MySQL.

## Запуск локально (без Docker)

```powershell
# убедитесь, что зависимости установлены
python -m pip install -r scripts/requirements.txt

# из корня проекта D:\tshirt
python scripts\generate_logs.py
python scripts\anomaly_detection.py
python scripts\update_anomaly_scores.py
python scripts\monitoring_system.py
```

Проверка подключения:
```powershell
python scripts\test_db_connection.py
```
