#
# docker-compose build && docker-compose push
#
# stage: 1
FROM node:13-alpine as development
WORKDIR /usr/src/app
COPY .npmrc .npmrc  
COPY ./package.json ./
RUN ["yarn", "install"]
RUN rm -f .npmrc
COPY . .
RUN ["yarn", "build"]

# Stage 2 - the production environment
FROM node:13-alpine as production
LABEL maintainer="api-worker"
WORKDIR /usr/src/app
COPY .npmrc .npmrc  
COPY package*.json ./
RUN yarn install --production
RUN rm -f .npmrc
COPY . .
COPY --from=development /usr/src/app/dist ./dist
EXPOSE 4000
CMD ["yarn", "start:prod"]