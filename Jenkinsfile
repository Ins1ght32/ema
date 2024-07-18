pipeline {
    agent any

    stages {
        stage('Checkout SCM') {
            steps {
                git 'https://github.com/Ins1ght32/ema.git'
            }
        }
        
        stage('Run Unit Tests') {
            steps {
                script {
                    echo "Entered Unit Test Stage"
                }
            }
        }
        
        stage('Code Quality Check via SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube';
                    withSonarQubeEnv('SonarQube EMA') {
                        if (isUnix()) {
                            sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=EMA -Dsonar.sources=."
                        } else {
                            bat "${scannerHome}/bin/sonar-scanner.bat -Dsonar.projectKey=EMA -Dsonar.sources=."
                        }
                    }
                }
            }       
        }
        
        stage('OWASP DependencyCheck') {
            steps {
                dependencyCheck additionalArguments: '--format HTML --format XML --nvdApiKey 7ad48849-c21a-49f4-9ddb-85151d39d039 --noupdate --enableExperimental', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
            }
        }
    }
    
    post {
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
        }
    }
}
