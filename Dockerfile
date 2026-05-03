# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install root dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Install client dependencies and build the client
RUN npm install --prefix client --legacy-peer-deps
RUN npm run build --prefix client

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
