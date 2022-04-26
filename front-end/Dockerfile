FROM node:17

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

EXPOSE 3000

COPY . .

CMD [ "npm", "start" ]
