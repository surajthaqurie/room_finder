FROM node:alpine

WORKDIR /app

COPY package*.* ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE 4000

CMD [ "npm","run", "dev" ]