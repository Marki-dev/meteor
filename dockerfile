# Base image
FROM node:latest

# Set working directory
WORKDIR /app

# Install dependencies for both the Express and Next.js apps
COPY . .
COPY package*.json ./

# Pull ENV from docker-compose
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Print the value of DATABASE_URL
RUN echo "DATABASE_URL: $DATABASE_URL"

# Build the Next.js app
RUN npm install
RUN npm install -g ts-node prisma

# Custom entry point to generate Prisma client
ENTRYPOINT ["/bin/bash", "-c", "prisma db push && npm run build && ts-node ."]
