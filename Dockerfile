# stage: 1
FROM node:13-alpine as builder
WORKDIR /app
COPY ./package.json ./
RUN yarn
COPY . .
RUN yarn build

# Stage 2 - the production environment
FROM node:13-alpine
LABEL maintainer="api-media"
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 4000
CMD ["yarn", "start:prod"]