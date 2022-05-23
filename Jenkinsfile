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
      steps {
        echo 'Hello'
      }
    }
    stage('build-frontend') {
      agent {
        dockerfile {
          filename 'Dockerfile'
          dir 'client'
          additionalBuildArgs '--build-arg serverurl=https://mochatto.com:4000'
        }
      }
      steps {
        sh '''
          echo "Build Frontend"
          echo $PWD
        '''
      }
    }
    stage('build-backend') {
      agent {
        dockerfile {
          filename 'Dockerfile'
          dir 'server'
        }
      }
      steps {
        sh '''
          echo "Build Backend"
          echo $PWD
        '''
      }
    }
    stage('test-frontend') {
      steps {
        sh '''
          echo "Test Frontend"
          ls
        '''
      }
    }
    stage('test-backend') {
      steps {
        sh '''
          echo "Test Backend"
          make dev-up
        '''
      }
    }
    stage('dev-deploy') {
      when {
        branch "dev"
      }
      steps {
        sh '''
          echo "Deploy Main"
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
