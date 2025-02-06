FROM node:18-alpine

# Install required locale package and set UTF-8 encoding
RUN apk add --no-cache bash \
    && apk add --no-cache --virtual .build-deps \
    && apk add --no-cache icu-libs

ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies and Nest CLI globally
RUN npm install --production \
    && npm install -g @nestjs/cli

# Copy the rest of the application files to the container
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3006

# Use the built files and start the application with Node.js
CMD ["npm", "run", "start:prod"]