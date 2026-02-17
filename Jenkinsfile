pipeline {
  agent any
  options { timestamps() }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Regression (Playwright in Docker)') {
      steps {
        sh '''
          set -e
          docker --version

          docker run --rm \
            -v "$PWD":/work \
            -w /work \
            mcr.microsoft.com/playwright:v1.50.0-jammy \
            bash -lc "npm ci || npm install && npx playwright test --reporter=html"
        '''
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