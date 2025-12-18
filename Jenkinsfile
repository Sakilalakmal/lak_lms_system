// Jenkins multibranch pipeline for LAK_LMS Next.js project

pipeline {
    agent any
    
    environment {
        GITHUB_TOKEN = credentials('LMS_TOKEN')
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE = 'sakilalakmal/lak_lms_system'
        // Skip environment variable validation during CI build
        // The app will validate env vars at runtime when deployed
        SKIP_ENV_VALIDATION = 'true'
        // Dummy DATABASE_URL for build-time (not used in production)
        DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy'
        // Dummy auth secrets for build-time
        BETTER_AUTH_SECRET = 'dummy-secret-for-build'
        BETTER_AUTH_URL = 'http://localhost:3000'
        AUTH_GITHUB_CLIENT_ID = 'dummy-github-id'
        AUTH_GITHUB_SECRET = 'dummy-github-secret'
        RESEND_API_KEY = 'dummy-resend-key'
        ARCJET_KEY = 'dummy-arcjet-key'
        AWS_ACCESS_KEY_ID = 'dummy-aws-key'
        AWS_SECRET_ACCESS_KEY = 'dummy-aws-secret'
        AWS_REGION = 'us-east-1'
        STRIPE_API_KEY = 'dummy-stripe-key'
        STRIPE_WEBHOOK_SECRET = 'dummy-webhook-secret'
        NEXT_PUBLIC_S3_NAME_IMGES = 'dummy-bucket'
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                bat 'npx pnpm install --frozen-lockfile'
            }
        }
        
        stage('Lint') {
            steps {
                echo 'Linting code...'
                bat 'npm run lint'
            }
        }
        
        stage('Generate Prisma Client') {
            steps {
                echo 'Generating Prisma client...'
                bat 'npx prisma generate'
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building Next.js application...'
                bat 'npx pnpm run build'
            }
        }

        stage('Build Docker Image') {
            when {
                branch 'main'
            }
            steps {
                echo 'Building Docker image...'
                script {
                    bat "docker build -t %DOCKER_IMAGE%:${env.BUILD_NUMBER} -t %DOCKER_IMAGE%:latest ."
                }
            }
        }

        stage('Push to Docker Hub') {
            when {
                branch 'main'
            }
            steps {
                echo 'Logging in to Docker Hub...'
                script {
                    bat "echo %DOCKERHUB_CREDENTIALS_PSW% | docker login -u %DOCKERHUB_CREDENTIALS_USR% --password-stdin"
                }
                echo 'Pushing Docker image to Docker Hub...'
                script {
                    bat "docker push %DOCKER_IMAGE%:${env.BUILD_NUMBER}"
                    bat "docker push %DOCKER_IMAGE%:latest"
                }
            }
        }

        stage('Auto-merge PR') {
            when {
                expression { 
                    return env.CHANGE_ID != null
                }
            }
            steps {
                echo "PR Detected: ${env.CHANGE_ID}. Attempting to merge..."
                script {
                    bat """
                        curl -X PUT ^
                        -H "Authorization: token %GITHUB_TOKEN%" ^
                        -H "Accept: application/vnd.github.v3+json" ^
                        https://api.github.com/repos/Sakilalakmal/lak_lms_system/pulls/%CHANGE_ID%/merge ^
                        -d "{\\"commit_title\\":\\"Auto-merge PR #%CHANGE_ID%\\",\\"merge_method\\":\\"merge\\"}"
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully! ✅'
        }
        failure {
            echo 'Pipeline failed! ❌'
        }
        always {
            script {
                // Logout from Docker Hub
                bat 'docker logout || exit 0'
            }
        }
        cleanup {
            cleanWs()
        }
    }
}
