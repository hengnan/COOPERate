FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build  # Build the frontend application
# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

