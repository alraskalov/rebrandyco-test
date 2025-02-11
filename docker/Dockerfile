# Используем Node.js образ
FROM node:23

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем все исходные коды
COPY services/ services/
COPY docker/ecosystem.config.js docker/ecosystem.config.js

# Устанавливаем зависимости для каждого микросервиса
RUN cd services/gateway && npm install && npm run build
RUN cd services/users-service && npm install && npm run build
RUN cd services/comments-service && npm install && npm run build

# Устанавливаем pm2 глобально
RUN npm install -g pm2

# Экспонируем порты для сервисов
EXPOSE 3000 3001 3002

# Запускаем все микросервисы через pm2
CMD ["pm2-runtime", "docker/ecosystem.config.js"]
