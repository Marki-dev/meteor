# Base image
FROM node:latest

# Set working directory
WORKDIR /app

# Install dependencies for both the Express and Next.js apps
COPY . .
COPY package*.json ./


# Build the Next.js app
RUN npm install
run npm install -g ts-node prisma
RUN prisma generate
RUN npm run build

# Switch back to the root directory and start the Express app
CMD ["ts-node", "."]
