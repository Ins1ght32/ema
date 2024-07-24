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
                        //sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=EMA -Dsonar.sources=. -Dsonar.host.url=http://172.30.141.123:9000 -Dsonar.token=172.30.141.123"
						sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=D3 -Dsonar.sources=. -Dsonar.host.url=http://192.168.1.188:9000 -Dsonar.token=192.168.1.188"
                    }
                }
            }       
        }
        
    }
    
    post {
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
        }
    }
}
