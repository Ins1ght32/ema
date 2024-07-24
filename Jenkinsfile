pipeline {
    agent any

    stages {
        stage('Checkout SCM') {
            steps {
                git 'https://github.com/Ins1ght32/ema.git'
            }
        }
		
		stage('Stop and Remove Current Test Environment') {
			steps{
				script{
					echo "Stopping and Removing"
					sleep(time: 12, unit: 'SECONDS') 
				}
			}
		}
		
		stage('Install Dependencies & Deploy New Test Environment') {
			steps{
				script{
					echo "Deploy"
					sleep(time: 13, unit: 'SECONDS')
				}
			}
		}
		
		
		stage('Run Unit Tests') {
            steps {
                script {
                    echo "Entered Unit Test Stage"
					sleep(time: 115, unit: 'SECONDS')
                }
            }
        }
        
        stage('Code Quality Check via SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube';
                        //sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=EMA -Dsonar.sources=. -Dsonar.host.url=http://172.30.141.123:9000 -Dsonar.token=172.30.141.123"
		    sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=EMA2 -Dsonar.sources=. -Dsonar.host.url=http://192.168.1.188:9000 -Dsonar.token=sqp_da994e8688dc6fb3154811d36049dee9a34a5d4c"
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
