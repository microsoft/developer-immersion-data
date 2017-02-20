FROM node:boron

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install && npm install -g gulp

COPY . /usr/src/app
RUN  gulp client

EXPOSE 8000
CMD [ "npm", "start"]