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

            echo "Workspace host: $(pwd)"
            ls -la
            ls -la tests || true
            ls -la tests/regression || true

            docker run --rm \
              -e BASE_URL="$BASE_URL" \
              -e BROWSER="$BROWSER" \
              -e GREP="$GREP" \
              -e CI="$CI" \
              -v "$(pwd)":/work \
              -w /work \
              mcr.microsoft.com/playwright:v1.58.2-jammy \
              bash -lc 'npm ci && npx playwright test --list && ( [ -n "$GREP" ] && npx playwright test tests/regression --project="$BROWSER" --grep "$GREP" --reporter=html || npx playwright test tests/regression --project="$BROWSER" --reporter=html )'
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
          allowMissing: false,
          alwaysLinkToLastBuild: true
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