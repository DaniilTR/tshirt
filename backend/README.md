# Backend (Node.js + Express)

Сервисы API, работающие поверх MySQL.

## Как это запускается в Docker

Контейнер собирается из `backend/Dockerfile` и стартует командой `npm start` (без nodemon).
В `docker-compose.yml` для сервиса `backend` заданы переменные окружения подключения к БД:
- DB_HOST=db
- DB_PORT=3306
- DB_USER=tshirt_user
- DB_PASSWORD=TshirtPass123!
- DB_NAME=tshirtbd

Порты: контейнер слушает 5000, проброшено на хост `http://localhost:5000`.

Старт только backend:
```powershell
$env:PATH = "$Env:ProgramFiles\Docker\Docker\resources\bin;" + $env:PATH
docker compose up -d backend
```

Логи backend:
```powershell
docker compose logs -f backend
```

Перезапуск backend:
```powershell
docker compose restart backend
```

Подключиться внутрь контейнера:
```powershell
docker compose exec backend sh
```

Проверка доступности API:
```powershell
# продукты
curl http://localhost:5000/api/products
# ютуберы
curl http://localhost:5000/api/youtubers
```

## Настройки .env

Пример `.env` — `backend/.env.example`. Скопируйте в `backend/.env` и при необходимости измените.

Внутри контейнера backend использует переменные от docker compose, локальный `.env` нужен для локального запуска вне Docker.

## Частые проблемы

- Контейнер часто перезапускается, а в логах `nodemon ... not found`:
  - В Docker используется `npm start` (без nodemon). Если изменяли Dockerfile — верните `CMD ["npm", "start"]`.

- Нет доступа к БД: проверьте, что контейнер `db` запущен, и значения DB_HOST/DB_PORT верные (`db:3306` для контейнеров, `127.0.0.1:3307` для хоста).

- Ошибки шифрования/валидации: middleware `encryption` и `security` применяются ко всем запросам. Для диагностики смотрите `docker compose logs backend`.
