FROM node:18-alpine

WORKDIR /app

COPY package*.* ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE 4004

CMD [ "npm","run", "dev" ]