FROM node
RUN apt-get update && apt-get install dnsutils -y

#RUN npm install
#
# Create app directory
RUN mkdir -p /usr/src/app

#change working DIR
WORKDIR /usr/src/app

# restart server on file change
RUN npm install -g nodemon

# Install app dependencies
#COPY package.json /usr/src/app

#Install new dependencies
RUN npm install

# Bundle app source
COPY . /usr/src/app

#open ports
EXPOSE 8080
CMD [ "nodemon", "start" ]

#Start with custom script, note you cannot use both CMD and an ENTRYPOINT file
#ENTRYPOINT ["/usr/src/app/init.sh"]
