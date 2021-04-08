#
# docker-compose build && docker-compose push
#
# stage: 1
FROM node:14-alpine as development
WORKDIR /usr/src/app
COPY .npmrc .npmrc  
COPY ./package.json ./
COPY ./yarn.lock ./
RUN ["yarn", "install"]
RUN rm -f .npmrc
COPY . .
RUN ["yarn", "build"]

# Stage 2 - the production environment
FROM node:14-alpine as production
LABEL maintainer="api-resume"

# TimeZone
RUN apk update
RUN apk upgrade
RUN apk add ca-certificates && update-ca-certificates
RUN apk add --update tzdata
ENV TZ=Asia/Bangkok
RUN rm -rf /var/cache/apk/*

WORKDIR /usr/src/app
COPY .npmrc .npmrc  
COPY package*.json ./
RUN yarn install --production
RUN rm -f .npmrc
COPY . .
COPY --from=development /usr/src/app/dist ./dist
EXPOSE 4000
CMD ["yarn", "start:prod"]