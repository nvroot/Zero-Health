FROM node:16-alpine

# Install PostgreSQL client for database connectivity checks
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"] 