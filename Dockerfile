# docker build --no-cache -t api-media . && docker tag api-media:latest snikom1723/api-media:latest && docker push snikom1723/api-media:latest

# stage: 1
FROM node:13-alpine as builder
WORKDIR /app
COPY ./package.json ./
RUN yarn
COPY . .
RUN yarn build

# Stage 2 - the production environment
FROM node:13-alpine
LABEL maintainer="dohome-2020"
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 4000
CMD ["yarn", "start:prod"]