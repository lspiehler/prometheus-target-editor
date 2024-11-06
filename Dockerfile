FROM docker.io/node:lts-alpine
LABEL maintainer="Lyas Spiehler"

RUN apk add --no-cache --upgrade bash git python3 py3-pip mkdocs-material py3-regex

RUN mkdir -p /var/node

WORKDIR /var/node

ARG CACHE_DATE=2024-11-06v1

RUN git clone https://github.com/lspiehler/prometheus-target-editor.git

WORKDIR /var/node/prometheus-target-editor

RUN npm install

RUN mkdocs build -d static

EXPOSE 8000/tcp

CMD ["node", "index.js"]