FROM node:16-slim AS BUILDER
LABEL maintainer="Felippe Chemello"
LABEL org.opencontainers.image.source https://github.com/felippechemello/sync.video

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY ./ ./

RUN yarn build

FROM node:16-alpine

ARG NODE_ENV

WORKDIR /usr/src/app

COPY --from=BUILDER /usr/src/app/ ./

EXPOSE 3000

CMD ["yarn", "start"]
