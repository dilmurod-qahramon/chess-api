FROM node:23-alpine3.20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
