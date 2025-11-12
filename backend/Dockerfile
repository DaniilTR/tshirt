# Используем Node.js LTS
FROM node:20-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
# В контейнере используем production-зависимости и обычный старт без nodemon
RUN npm install --production

# Копируем весь проект
COPY . .

# Запускаем сервер
EXPOSE 5000
CMD ["npm", "start"]