# docker build --no-cache -t api-media . && docker tag api-media:latest snikom1723/api-media:latest && docker push snikom1723/api-media:latest

# stage: 1
FROM node:10 as builder
WORKDIR /app
COPY ./package.json ./
RUN yarn
COPY . .
RUN yarn build

# Stage 2 - the production environment
FROM node:10-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 4000
CMD ["yarn", "start:prod"]