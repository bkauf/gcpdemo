FROM node:10 as build

# Create app directory
RUN mkdir -p /usr/src/app

#change working DIR
WORKDIR /usr/src/app

# restart server on file change for dev
#RUN npm install -g nodemon

# Copy app files
COPY . /usr/src/app
# Install app dependencies
RUN npm install

#Copy contents into distroless build
FROM gcr.io/distroless/nodejs:10
COPY --from=build /usr/src/app /app
WORKDIR /app
EXPOSE 8080
CMD ["app.js"]

#Start with custom script, note you cannot use both CMD and an ENTRYPOINT file
#ENTRYPOINT ["/usr/src/app/init.sh"]
#CMD [ "npm", "start" ]
