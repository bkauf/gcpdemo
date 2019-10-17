stages {
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build registry + ":$BUILD"
        }}
}
stage('Push to Registry') {
      steps{
        script {
          docker.withRegistry( '', registryCredential ) {
              dockerImage.push()
                  }}}
}
stage('Remove Unused docker image') {
       steps{
          sh "docker rmi $registry:$BUILD"
              }
            }}
}
