pipeline {
  agent { 
    label "linux" 
  }
  options {
    buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '5', daysToKeepStr: '', numToKeepStr: '5')
    disableConcurrentBuilds()
  }
  stages {
    stage('Hello') {
      environment {
        GIT_BRANCH = "${BRANCH_NAME}"
      }
      steps {
        echo 'Hello'
        echo "${GIT_BRANCH}"
      }
    }
    stage('dev-deploy') {
      when {
        anyOf {
          branch "ft-*";
          branch "bg-*";
          branch "rf-*";
        }
      }
      steps {
        sh '''
          echo "Deploy Dev"
          make beta-up
        '''
      }
    }
    stage('main-deploy') {
      when {
        branch "main"
      }
      steps {
        sh '''
          make prod-up
        '''
      }
    }
  }
}
