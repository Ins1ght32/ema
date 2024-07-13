pipeline {
	agent any
	stages {
		stage('Checkout SCM') {
			steps {
				git 'https://github.com/Ins1ght32/ema.git'
			}
		}
		
		stage('Stop & Remove Current Test Environment') {
            steps {
                script {
                    // Print the current directory and list files
                    //sh 'pwd'
                    //sh 'ls -la'
                    //echo "DEV_DOCKER_COMPOSE_FILE: ${env.DOCKER_COMPOSE_FILE}"
                    //def devcontainersRunning = sh(script: 'docker compose -f ${DOCKER_COMPOSE_FILE} ps -q', returnStdout: true).trim()
                    //if (devcontainersRunning) {
                    //    echo "Containers defined in the Dev Docker Compose file are running. Bringing them down..."
                    //    sh "docker compose -f ${DOCKER_COMPOSE_FILE} down"
                    //} else{
                    //    echo "No containers defined in the Docker Compose file are running. Skipping this step."
                    //}
                    //sh 'docker system prune -f'
                }
            }
        }
		
		stage('Install Dependencies & Deploy New Test Environment') {
            steps {
                script {
				echo "Entered Install Dependencies & Deploy New Test Environment Stage"
                    // Build and start services defined in docker-compose-dev.yml
                    //sh 'docker compose -f ${DOCKER_COMPOSE_FILE} up --build -d'
                }
            }
        }
		
		stage('Run Unit Tests'){
			steps{
				script{
					echo "Entered Unit Test Stage"
				}
			}
		}
		
		stage('Code Quality Check via SonarQube') {
            		steps {
                		script {
                    			def scannerHome = tool 'SonarQube';
                       			withSonarQubeEnv('SonarQube EMA') {
                        			sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=EMA -Dsonar.sources=."
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
