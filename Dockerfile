FROM node:8

WORKDIR /usr/src/app
COPY package.json webpack.config.js yarn.lock ./
COPY src ./src

RUN yarn install
RUN yarn build

CMD ["yarn", "start"]

