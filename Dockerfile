# Multi-stage Dockerfile for CareerPilot AI Root Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files & server source
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/
WORKDIR /app/server
RUN npm install

WORKDIR /app
COPY server ./server
WORKDIR /app/server
RUN npm run build

EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000

CMD ["npm", "start"]
