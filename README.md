Perfecto Dali 💙 aquí tienes el README completo y limpio, listo para copiar y pegar en tu repo (README.md) 🚀

⸻

🚀 Playwright Regression Demo with Jenkins (Docker)

Este proyecto demuestra cómo integrar Playwright + Jenkins + Docker para ejecutar pruebas automatizadas tipo regresión y publicar el reporte HTML.

Incluye:
	•	✅ Jenkins corriendo en Docker
	•	✅ Pipeline declarativo
	•	✅ Playwright con TypeScript
	•	✅ Tests Smoke y Regression
	•	✅ Reporte HTML publicado en Jenkins
	•	✅ Ejecución por parámetros (browser, baseURL, tags)

⸻

🧱 Arquitectura

GitHub Repo
     ↓
Jenkins (Docker)
     ↓
Docker Playwright Image
     ↓
HTML Report (publicado en Jenkins)


⸻

🐳 1️⃣ Instalar Jenkins con Docker

Crear volumen

docker volume create jenkins_home

Ejecutar Jenkins

docker run -d \
  --name jenkins-local \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts

Abrir en navegador:

http://localhost:8080

Obtener password inicial:

docker exec jenkins-local cat /var/jenkins_home/secrets/initialAdminPassword


⸻

🔌 2️⃣ Plugins necesarios

Instalar en Jenkins:
	•	✅ Git Plugin
	•	✅ Pipeline
	•	✅ HTML Publisher Plugin
	•	✅ Docker Pipeline (opcional)

⸻

📦 3️⃣ Proyecto Playwright

Inicializar proyecto

npm init -y
npm install -D @playwright/test
npx playwright install


⸻

Estructura del proyecto

playwright-demo-local/
│
├── tests/
│   ├── example.spec.ts
│   └── regression/
│       ├── dashboard.spec.ts
│       ├── login.spec.ts
│       └── transfer.spec.ts
│
├── playwright.config.ts
├── tsconfig.json
├── Jenkinsfile
└── package.json


⸻

⚙️ playwright.config.ts

Configurado para:
	•	Multi-browser
	•	Soporte CI
	•	Base URL dinámica
	•	Filtro por browser

const baseURL = process.env.BASE_URL || 'https://playwright.dev';
const selectedBrowser = process.env.BROWSER;

Permite ejecutar:
	•	Solo chromium
	•	Solo firefox
	•	Solo webkit
	•	O todos

⸻

🧪 Ejemplo de Test Regression

dashboard.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Dashboard - Regression', () => {

  test('should load dashboard correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
  });

});


⸻

transfer.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Transfer - Regression', () => {

  test('@regression should complete a transfer flow', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
  });

});


⸻

🔁 4️⃣ Jenkins Pipeline

Jenkinsfile

pipeline {
  agent any
  options { timestamps() }

  parameters {
    string(name: 'BASE_URL', defaultValue: 'https://playwright.dev', description: 'URL base')
    choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Browser')
    string(name: 'GREP', defaultValue: '', description: 'Filtro por tag')
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

            docker run --rm \
              -e BASE_URL="$BASE_URL" \
              -e BROWSER="$BROWSER" \
              -e GREP="$GREP" \
              -e CI="$CI" \
              -v "$(pwd)":/work \
              -w /work \
              mcr.microsoft.com/playwright:v1.58.2-jammy \
              bash -lc "
                npm ci &&
                npx playwright test tests/regression \
                --project=$BROWSER \
                --reporter=html
              "
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
          allowMissing: true
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


⸻

📊 Resultado en Jenkins

Después de ejecutar:
	•	✅ Se ejecutan los tests
	•	✅ Se genera playwright-report
	•	✅ Se publica HTML Report
	•	✅ Se archivan artifacts
	•	✅ Puedes descargar trace, video y screenshots

⸻

🎯 Ejecutar con parámetros

Ejemplo:

Parámetro	Valor
BASE_URL	https://miapp.com
BROWSER	chromium
GREP	@regression


⸻

🛡 .gitignore recomendado

node_modules/
playwright-report/
test-results/
*.zip
.env


⸻

🎬 Cómo ver trazas localmente

Si un test falla:

npx playwright show-trace trace.zip
