pipeline {
   agent any

   environment {
     // You must set the following environment variables
     // ORGANIZATION_NAME
     // YOUR_DOCKERHUB_USERNAME (it doesn't matter if you don't have one)
     
     SERVICE_NAME = "api-media"
     REPOSITORY_TAG="${YOUR_DOCKERHUB_USERNAME}/${ORGANIZATION_NAME}-${SERVICE_NAME}:${BUILD_ID}"

     dockerCredential='HubDocker'
     dockerImage = ''
   }

   stages {
      stage('Preparation') {
         steps {
            cleanWs()
            git credentialsId: 'GitLab', url: "https://gitlab.com/${ORGANIZATION_NAME}/${SERVICE_NAME}"
         }
      }

      stage('Build Docker Image') {
         steps{
            script {
               dockerImage = docker.build "$REPOSITORY_TAG"
            }
         }
      }

      stage('Deploy Image') {
         steps{
            script {
               docker.withRegistry( '', dockerCredential ) {
                  dockerImage.push()
               }
            }
         }
      }      

      stage('Deploy to Cluster') {
          steps {
            sh 'envsubst < ${WORKSPACE}/deploy.yml | kubectl apply -f -'
          }
      }

      stage('Docker image prune dangling') { 
         steps {
            sh 'docker image prune --force --filter "dangling=true"'
         }
      }

      stage('Docker image prune repository') { 
         steps { 
            sh 'docker image prune --force --filter "label=maintainer=${SERVICE_NAME}" -a'
         }
      }

   }
}