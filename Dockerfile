FROM node:22-slim

WORKDIR /dist

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install
RUN yarn global add ts-node

COPY . .

EXPOSE 8080
EXPOSE 8090

CMD [ "yarn", "start" ]