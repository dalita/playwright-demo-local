pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.50.0-jammy'
      args '-u root:root'
    }
  }

  options { timestamps() }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps {
        sh 'node -v'
        sh 'npm -v'
        sh 'npm ci || npm install'
      }
    }

    stage('Regression') {
      steps {
        sh 'npx playwright test --reporter=html'
      }
    }

    stage('Publish report') {
      steps {
        publishHTML([
          reportDir: 'playwright-report',
          reportFiles: 'index.html',
          reportName: 'Playwright Regression'
        ])
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**,test-results/**', allowEmptyArchive: true
    }
  }
}