FROM node:18 as builder

# Create app directory
WORKDIR /frontend

COPY yarn.lock ./
COPY package*.json ./

# Install app dependencies
RUN yarn install

COPY . .

RUN yarn build


# Stage 2 - the production environment
FROM nginx:1.21.3-alpine

COPY ./etc/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
