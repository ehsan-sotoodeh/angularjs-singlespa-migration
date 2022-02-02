# Dockerfile for k2/admin/frontend. Frontend is a component of the K2 react micro frontend, supporting the K2 admin backend.

FROM node:16.13.0 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY . ./

RUN yarn install

EXPOSE 9002

CMD ["yarn", "start"]
