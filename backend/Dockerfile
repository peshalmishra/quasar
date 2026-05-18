# backend/Dockerfile
FROM node:20-alpine


# Create app directory
WORKDIR /app


COPY package*.json ./
RUN npm install

# Copy the rest of the files
COPY . .



# Expose backend port (change if needed)
EXPOSE 4000

# Start the application
CMD ["node", "app.js"]