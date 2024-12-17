# Use the official Node.js image from Docker Hub
FROM node:16-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

COPY .env.example .env

# Expose the port the app will run on
EXPOSE 3005

# Command to run your application
CMD ["npm", "start"]
