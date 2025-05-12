FROM node:18.20.8-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production && npm install -g @nestjs/cli && npm install --save-dev @types/node

COPY . .

RUN npm run build

EXPOSE 5050

CMD ["npm", "run", "start:prod"]