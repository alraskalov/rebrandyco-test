FROM node:23 AS build

WORKDIR /app

COPY services/gateway/package*.json services/gateway/
COPY services/users-service/package*.json services/users-service/
COPY services/comments-service/package*.json services/comments-service/

RUN cd services/gateway && npm install
RUN cd services/users-service && npm install
RUN cd services/comments-service && npm install

COPY services/ services/
COPY docker/ecosystem.config.js docker/ecosystem.config.js

RUN cd services/gateway && npm run build
RUN cd services/users-service && npm run build
RUN cd services/comments-service && npm run build

RUN npm install -g pm2

EXPOSE 3000 3001 3002

CMD ["pm2-runtime", "docker/ecosystem.config.js"]
