FROM node:8

WORKDIR /usr/src/app
COPY package.json webpack.config.js yarn.lock ./
COPY src ./src

RUN yarn install
RUN yarn build

# Make configurable with config
EXPOSE 3000

RUN pwd
CMD ["yarn", "start"]

