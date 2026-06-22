# Stage 1: Build the Angular application
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the custom nginx config to handle Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built angular app from the build stage to the nginx html directory
COPY --from=build /app/dist/front-end-obour /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
