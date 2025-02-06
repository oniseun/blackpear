FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production \
    && npm install -g @nestjs/cli

COPY . .

RUN npm run build

EXPOSE 5050

CMD ["npm", "run", "start:prod"]