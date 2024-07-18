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
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=EMA -Dsonar.sources=. -Dsonar.host.url=http://172.30.141.123:9000 -Dsonar.token=172.30.141.123"
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
