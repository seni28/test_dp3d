# Use the latest Alpine image as the base image
FROM alpine:latest

WORKDIR /front
# Install Node.js and npm
RUN apk add --update --no-cache nodejs npm icu-data-full
RUN npm install -g nodemon

COPY package.json .
COPY ./prisma ./prisma/
# Copy package.json and package-lock.json to the container

# Install npm packages
RUN npm install && npx prisma generate


COPY . .

EXPOSE 3000

RUN npm run build
# Command to run the application
CMD ["npm", "run", "prod"]
