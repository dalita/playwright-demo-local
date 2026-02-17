pipeline {
  agent any
  options { timestamps() }

  stages {
    stage('Clean Workspace') {
      steps {
        deleteDir()
      }
    }

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Debug workspace') {
      steps {
        sh '''
          set -e
          echo "=== Workspace ==="
          pwd
          ls -la
          echo "=== Must exist ==="
          test -f package.json && echo "OK package.json" || (echo "MISSING package.json" && exit 2)
          test -f package-lock.json && echo "OK package-lock.json" || (echo "MISSING package-lock.json" && exit 2)
        '''
      }
    }

    stage('Regression (Playwright via Docker)') {
      steps {
        sh '''
          set -e
          docker --version

          docker run --rm \
            -v "$PWD":/work \
            -w /work \
            mcr.microsoft.com/playwright:v1.50.0-jammy \
            bash -lc 'pwd && ls -la && npm ci && npx playwright test --reporter=html'
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