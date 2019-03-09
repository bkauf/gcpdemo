FROM node:8.15.1-alpine
RUN apk update

#RUN npm install
#
# Create app directory
RUN mkdir -p /usr/src/app

#change working DIR
WORKDIR /usr/src/app

# restart server on file change
#RUN npm install -g nodemon

# Install app dependencies
#COPY package.json /usr/src/app

# Bundle app source
COPY . /usr/src/app

#Install new dependencies
RUN npm update
#open ports
EXPOSE 8080
#CMD [ "nodemon", "start" ]
CMD ["npm", "start"]

#Start with custom script, note you cannot use both CMD and an ENTRYPOINT file
#ENTRYPOINT ["/usr/src/app/init.sh"]
