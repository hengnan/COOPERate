# Use Node.js as a base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

COPY . .

# Make port 8000 available to the outside this container
EXPOSE 8000

# Command to run the proxy server
CMD ["node", "server.js"]
