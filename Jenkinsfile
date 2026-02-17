pipeline {
  agent any
  options { timestamps() }

  stages {
    stage('Clean Workspace') {
      steps { deleteDir() }
    }

    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Regression (Playwright via Docker)') {
      steps {
        sh '''
          set -e
          docker --version

          # Detecta el volumen real donde vive /var/jenkins_home (jenkins_home)
          JENKINS_VOL="$(docker volume ls -q | grep -E 'jenkins_home$|_jenkins_home$' | head -n 1)"
          echo "Using Jenkins volume: $JENKINS_VOL"
          test -n "$JENKINS_VOL"

          # Corre Playwright usando el workspace real dentro del volumen
          docker run --rm \
            -v "$JENKINS_VOL":/var/jenkins_home \
            -w /var/jenkins_home/workspace/Playwright \
            mcr.microsoft.com/playwright:v1.58.2-jammy \
            bash -lc 'npm ci && npx playwright test --reporter=html'
        '''
      }
    }

   stage('Publish report') {
        steps {
            publishHTML(target: [
            reportDir: 'playwright-report',
            reportFiles: 'index.html',
            reportName: 'Playwright Regression',
            keepAll: true,
            alwaysLinkToLastBuild: true,
            allowMissing: false
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