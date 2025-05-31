FROM node:16-alpine

# Install PostgreSQL client for database connectivity checks and curl for Ollama API
RUN apk add --no-cache postgresql-client curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Make scripts executable
RUN chmod +x scripts/*.sh

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"] 