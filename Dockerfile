FROM node:carbon

RUN apt-get update && apt-get install -y redis-server

WORKDIR /usr/src/bockmint-node

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3002

CMD [ "redis-server", "--daemonize", "yes" ]
CMD [ "npm", "start" ]