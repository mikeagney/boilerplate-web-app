ARG TARGET=production
FROM node:12.6.0-alpine AS node

FROM node AS build-debug
WORKDIR /usr/src/app

COPY package.json webpack.config.js yarn.lock ./
COPY src ./src
COPY migrations ./migrations
COPY migrations ./scripts

RUN yarn install && yarn build

FROM build-debug AS build-production
WORKDIR /usr/src/app

RUN yarn install --production && yarn cache clean && rm -rf src

FROM build-${TARGET} as build-target

FROM node
WORKDIR /usr/src/app
COPY --from=build-target /usr/src/app .

CMD ["yarn", "start"]

