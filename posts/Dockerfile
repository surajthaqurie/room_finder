FROM node:18-alpine

WORKDIR /app

COPY package*.* ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE 4003

CMD [ "npm","run", "dev" ]

RUN npx prisma generate
