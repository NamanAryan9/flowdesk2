# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the entire application first
# This ensures that postinstall scripts (like client install) have access to their files
COPY . .

# Install all dependencies (root and client via postinstall)
RUN npm install --legacy-peer-deps

# Build the client
RUN npm run build --prefix client

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
