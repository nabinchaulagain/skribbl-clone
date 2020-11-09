FROM node AS builder
WORKDIR /app
COPY "./package*.json" "./"
RUN npm install
COPY "./" "./"
RUN npm run build

FROM nginx
COPY "./nginx/default.conf" "/etc/nginx/conf.d/default.conf"
COPY --from=builder "/app/build" "/usr/share/nginx/html"
EXPOSE 3000