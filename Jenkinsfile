pipeline {
	agent any
	stages {
		stage('Checkout SCM') {
			steps {
				git 'https://github.com/Ins1ght32/ema.git'
			}
		}
		
		stages {
        stage('Check and Run Front End') {
            steps {
                script {
                    // Check if 'yarn dev' is running
                    //def isYarnDevRunning = bat(script: 'tasklist /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq yarn dev*"', returnStatus: true) == 0

                    //if (!isYarnDevRunning) {
                        // Change to the front end directory and run 'yarn dev'
                    //    dir('C:\\path\\to\\your\\frontend\\directory') {
                    //        bat 'start yarn dev'
                        }
                    //} else {
                    //    echo "Front end 'yarn dev' is already running."
                    //}
                }
            }
        }

        stage('Check and Run Back End') {
            steps {
                script {
                    // Check if 'node.exe' is running
                    def isNodeAppRunning = bat(script: 'tasklist /FI "IMAGENAME eq node.exe"', returnStatus: true) == 0

                    if (!isNodeAppRunning) {
                        // Change to the back end directory and run 'node app.js'
                        dir('C:\\path\\to\\your\\backend\\directory') {
                            bat 'start node app.js'
                        }
                    } else {
                        echo "Back end 'node app.js' is already running."
                    }
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
