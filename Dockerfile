#
# docker build --build-arg NPM_TOKEN=${NPM_TOKEN} -t api-media:latest . 
# docker tag api-media:latest newsolution/api-media:latest 
# docker push newsolution/api-media:latest
#
# stage: 1
FROM node:13-alpine as builder
WORKDIR /app
COPY .npmrc .npmrc  
COPY ./package.json ./
RUN yarn
RUN rm -f .npmrc
COPY . .
RUN yarn build

# Stage 2 - the production environment
FROM node:13-alpine
LABEL maintainer="api-media"
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 4000
CMD ["yarn", "start:dev"]