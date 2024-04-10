FROM node:alpine

RUN npm i npm@latest -g

WORKDIR /app

COPY package*.* ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE 4000

CMD [ "npm","run", "dev" ]