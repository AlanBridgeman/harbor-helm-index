FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./
COPY .npmrc ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./src ./src
COPY ./gulpfile.mjs ./
COPY ./tsconfig.json ./

RUN yarn build

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG PORT=3000
ENV PORT=$PORT

EXPOSE $PORT

CMD ["yarn", "start"]

