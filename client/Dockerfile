FROM node:12.16.2-alpine as build

ENV PARCEL_WORKERS=1

WORKDIR /client

COPY package.json package-lock.json ./
COPY ./.env.development ./.env.production
COPY ./assets ./assets
COPY ./lib ./lib

RUN npm install --only=prod

RUN npm run build

FROM node:12.16.2-alpine

RUN npm install http-server -g

WORKDIR /app

COPY --from=build /client/dist .

CMD http-server -p 1234