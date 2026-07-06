# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend .

RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/src ./src

# Copy built frontend to backend
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
