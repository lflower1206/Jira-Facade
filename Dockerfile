FROM node:24-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && exec npx next dev -H 0.0.0.0"]
