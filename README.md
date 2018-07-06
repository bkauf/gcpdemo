
# Node.js app that allows you to test various GCP products/features

![gcpdemo](/gcpdemo-ss.png?raw=true "GCP Demo")

This app can be run as a container or google app engine project. Current capabilities include:

* Ability to toggle the /health page from a 200 to a 500 Error for health check testing
* Dialogflow and Chatbase bot tester
* Pubsub message submissions

## To Use:

You can create a container out of these file with the supplied Dockerfile or run the code in an app engine instance on GCP.
Optional Edit the env.sh file to include the necessary api keys.

```
docker build -t bkauf/gcpdemo:1.1 .
docker run -p 8080:8080 bkauf/gcpdemo:1.1
```
