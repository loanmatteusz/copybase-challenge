FROM node:18

WORKDIR /backend

RUN rm -f /usr/local/bin/yarn

RUN npm install -g --force yarn

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
