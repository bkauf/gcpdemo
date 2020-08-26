FROM node:current-alpine3.11

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY package*.json ./

RUN npm install

COPY . .
COPY notice.sh /usr/local/bin/notice.sh
ENTRYPOINT ["/usr/local/bin/notice.sh"]
