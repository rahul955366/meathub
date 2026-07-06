# Stage 1: Build
FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build with production Next.js
RUN npm run build

# Stage 2: Production runner (slim image)
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
