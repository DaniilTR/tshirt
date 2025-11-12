FROM python:3.12-slim

WORKDIR /app

# Устанавливаем системные зависимости (если понадобятся в будущем)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Копируем requirements и устанавливаем
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Копируем только orchestrator сейчас, остальной код будет примонтирован volume
COPY main.py ./scripts/main.py

ENV PYTHONUNBUFFERED=1
CMD ["python", "-u", "scripts/main.py"]
