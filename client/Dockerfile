FROM node:20.15.1-alpine3.20

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm ci

COPY . /usr/src/app

EXPOSE 4000

CMD npm run dev