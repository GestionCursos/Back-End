#Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

#Etapa 2: Runtime
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

RUN npm install --only=production

EXPOSE 3000

CMD ["node", "--max-old-space-size=4096", "dist/main"]
