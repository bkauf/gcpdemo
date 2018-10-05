
# Node.js app that allows you to test various GCP products/features


This app can be run as a container or google app engine project. Current capabilities include:

* Ability to toggle the /health page from a 200 to a 500 Error for health check testing
* Dialogflow and Chatbase bot tester
* Pubsub message submissions
* Google Cloud Spanner Database creation, data insert, and query

## To Use:
### Docker
You can create a container out of these file with the supplied Dockerfile or run the code in an app engine instance on GCP.
Optional Edit the env.sh file to include the necessary api keys.

```
docker build -t bkauf/gcpdemo:1.1 .
docker run -itd -p 8080:8080 bkauf/gcpdemo:1.1
```
### In K8s with the container image hosted remotely
You'd have to edit the following files to make sure the container image path was correct and your Domain name in the ingress file was already entered into your Cloud DNS config with an A record
```
kubectl create -f node-deployment.yaml
kubectl create -f bkauf-service.yaml
kubectl create -f node-ingress.yaml
```

![gcpdemo](/gcpdemo-ss.png?raw=true "GCP Demo")

## Dialogflow bot screen
![gcpdemo](/dialogflow1-ss.png?raw=true "GCP Dialogflow")
