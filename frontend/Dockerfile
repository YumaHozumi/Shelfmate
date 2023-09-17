# ビルド段階
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build

# 実行段階
FROM httpd:2.4

# .htaccessファイルをコピー
COPY .htaccess /usr/local/apache2/htdocs/

COPY --from=build /app/dist /usr/local/apache2/htdocs/
COPY my-httpd.conf /usr/local/apache2/conf/httpd.conf
