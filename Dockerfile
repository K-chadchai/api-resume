#
# docker build --build-arg NPM_TOKEN=${NPM_TOKEN} -t api-authen:latest . && docker tag api-authen:latest newsolution/api-authen:latest && docker push newsolution/api-authen:latest
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
LABEL maintainer="api-authen"
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 4000
CMD ["yarn", "start:dev"]