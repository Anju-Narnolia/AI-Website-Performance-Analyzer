pipeline {
    agent any

    environment {
        APP_NAME = "ai-analyzer"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Anju-Narnolia/AI-Website-Performance-Analyzer', credentialsId: 'github-creds'
            }
        }
        stage('Build & Start Services') {
            steps {
                script {
                    sh 'docker-compose down || true'
                    sh 'docker-compose up -d --build'
                }
            }
        }
        stage('Check Running Containers') {
            steps {
                sh 'docker ps'
            }
        }
    }
    
    post {
        success {
            echo '✅ All services are up and running!'
        }
        failure {
            echo '❌ Something failed!'
        }
    }
}