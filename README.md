
# Node.js app that allows you to test various GCP products/features


This app can be run as a container or google app engine project. Current capabilities include:

* Ability to toggle the /health page from a 200 to a 500 Error for health check testing
* Dialogflow and Chatbase bot tester
* Pubsub message submissions
* Google Cloud Spanner Database creation, data insert, and query

## To Use:
### Docker
You can create a container out of these file with the supplied Dockerfile or run the code in an app engine instance on GCP.
#### Optional:
 By default nodemon is setup in the Dockerfile however you will see the comments to enable an init.sh script inplace of where nodemon starts. You can use this script to load other things like a file of variables for each GCP service. Edit the env.sh file to include the necessary api keys and the init.sh to start the node or nodemon server.

```
docker build -t gcpdemo:5.0 .
docker run -itd -p 8080:8080 gcpdemo:5.0
```
or if you want to map for active development
```
docker run -itd -p 8080:8080 -v [your/local/path/]:/usr/src/app gcpdemo:5.0
```

### In GKE with Global LB
You'd have to edit the following files to make sure the container image path was correct. Default is pulling bkauf/gcpdemo:5.0 from dockerhub.com
```
kubectl create -f k8s/deployments/frontend-staging.yaml
kubectl create -f k8s/services/frontend-staging.yaml
```

![gcpdemo](/gcpdemo-ss.png?raw=true "GCP Demo")

## Dialogflow bot screen
![gcpdemo](/dialogflow1-ss.png?raw=true "GCP Dialogflow")
