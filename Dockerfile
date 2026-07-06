FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend code
COPY backend/src ./src

# Install frontend dependencies and build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

# Copy frontend code
COPY frontend .

# Build frontend
RUN npm run build

# Move built frontend to backend public folder
RUN mkdir -p /app/public && cp -r dist/* /app/public/

# Back to app root
WORKDIR /app

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "src/server.js"]
