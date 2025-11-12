#!/bin/bash
# backup_automation.sh
# Использует переменные из backend/.env (если запущен из корня проекта)
ENV_FILE="backend/.env"
if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' $ENV_FILE | xargs)
fi

DB_NAME=${DB_NAME:-tshirtbd}
DB_USER=${DB_USER:-root}
DB_PASS=${DB_PASSWORD:-}
BACKUP_DIR=${BACKUP_DIR:-/var/backups/mysql}
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=${RETENTION_DAYS:-7}

mkdir -p "$BACKUP_DIR"

# Если требуется использовать mysqldump с паролем без пробела -p$DB_PASS
if [ -z "$DB_PASS" ]; then
  mysqldump -u "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/${DB_NAME}_${DATE}.sql"
else
  mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz"
fi

if [ $? -eq 0 ]; then
  echo "Резервная копия создана: ${DB_NAME}_${DATE}.sql(.gz)"
else
  echo "Ошибка при создании резервной копии!"
  exit 1
fi

# Удаляем старые резервы
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete