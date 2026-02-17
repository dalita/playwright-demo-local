pipeline {
  agent any
  options { timestamps() }

  parameters {
    string(name: 'BASE_URL', defaultValue: 'https://playwright.dev', description: 'URL base de pruebas')
    choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Browser a ejecutar')
    string(name: 'GREP', defaultValue: '', description: 'Filtro por tag (ej: @regression)')
  }

  stages {
    stage('Clean Workspace') {
      steps { deleteDir() }
    }

    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Regression (Playwright via Docker)') {
      steps {
        withEnv([
          "BASE_URL=${params.BASE_URL}",
          "BROWSER=${params.BROWSER}",
          "GREP=${params.GREP}",
          "CI=true"
        ]) {
          sh '''
            set -e
            docker --version

            # Detecta el volumen real donde vive /var/jenkins_home
            JENKINS_VOL="$(docker volume ls -q | grep -E 'jenkins_home$|_jenkins_home$' | head -n 1)"
            echo "Using Jenkins volume: $JENKINS_VOL"
            test -n "$JENKINS_VOL"

            docker run --rm \
              -e BASE_URL="$BASE_URL" \
              -e BROWSER="$BROWSER" \
              -e GREP="$GREP" \
              -e CI="$CI" \
              -v "$JENKINS_VOL":/var/jenkins_home \
              -w /var/jenkins_home/workspace/Playwright \
              mcr.microsoft.com/playwright:v1.58.2-jammy \
              bash -lc 'ls -la && npm ci && npx playwright test --list && \
                if [ -n "$GREP" ]; then \
                  npx playwright test tests/regression --project="$BROWSER" --grep "$GREP" --reporter=html; \
                else \
                  npx playwright test tests/regression --project="$BROWSER" --reporter=html; \
                fi'
          '''
        }
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