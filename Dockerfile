FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Install frontend dependencies
COPY frontend/package*.json ../frontend/
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps

# Copy and build frontend
COPY frontend .
RUN npm run build

# Copy backend source
WORKDIR /app
COPY backend/src ./backend/src

# Copy frontend dist to public
RUN mkdir -p /app/public && cp -r /app/frontend/dist/* /app/public/

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "backend/src/server.js"]
