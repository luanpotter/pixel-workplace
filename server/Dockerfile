FROM node:12.16.2-alpine

WORKDIR /server

COPY . .

RUN npm install --only=prod

CMD npm start