pipeline {
    agent any
    
    
    environment {
        SATURN_DRIVER = 'asdasd'
        SATURN_URL    = 'http://localhost:8080'
    }
    

    stages {
        stage('Build') { 
            steps {
                sh 'find / -name "*firefox*" | grep -v "Permission denied"'
                sh 'mvn -B -DskipTests clean package'
				sh 'rm src/main/resources/config/application-dev.yml'
				sh 'cp src/main/resources/config/application-dev-jenkins.yml src/main/resources/config/application-dev.yml'
				sh 'mvn -Dtest=TestSelenium test'
            }
        }
    }
    post {
        failure {
            emailext (
                    subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                    body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
                        <p>Check console output at <a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>""",
                    recipientProviders: [[$class: 'DevelopersRecipientProvider']],
                    to: 'fattouch@uvic.ca',
                    mimeType: 'text/html'
                )
        }
    }
}
