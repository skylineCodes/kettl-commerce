FROM node:alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine As production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm

RUN npm install --production
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/order-service/main"]
