// Jenkins multibranch pipeline for LAK_LMS Next.js project

pipeline {
    agent any
    
    environment {
        GITHUB_TOKEN = credentials('LMS_TOKEN')
        // Skip environment variable validation during CI build
        // The app will validate env vars at runtime when deployed
        SKIP_ENV_VALIDATION = 'true'
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
        cleanup {
            cleanWs()
        }
    }
}
