# Etapa 1: build
FROM node:22-alpine as builder

WORKDIR /usr/app

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

# Etapa 2: produção
FROM node:22-alpine as runner

WORKDIR /usr/app

COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/package.json ./package.json
COPY --from=builder /usr/app/node_modules ./node_modules

COPY .env.development /usr/app/.env

EXPOSE $PORT

CMD ["node", "dist/main"]
