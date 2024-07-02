# Stage 1: Build the React application
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (Commented out for local build)
# RUN npm install --registry=https://registry.npmmirror.com --no-fund

# Copy the rest of the application code
COPY . .

# Build the application (Commented out for local build)
# RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.22

# Copy the build output to Nginx's default public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
