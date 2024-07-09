/* groovylint-disable CompileStatic, DuplicateStringLiteral, GStringExpressionWithinString, LineLength */
// Jenkinsfile configuration disabling specific lint rules for cleaner script

// Defines a pipeline block that contains the entire continuous delivery pipeline
pipeline {
    agent any  // Specifies that this pipeline can run on any available agent

    // Defines environment variables that are accessible within the pipeline
    environment {
        NETWORK = 'ruoyi'  // Network name for Docker to enable networking among containers
        IMAGE_NAME = 'tldraw-ui'  // Name of the Docker image to be built
        WS = "${WORKSPACE}"  // Shortcut for the Jenkins workspace variable
        PROFILE = 'prod'  // Build profile, typically used to differentiate environments
        NGINX = 'tldraw'  // Nginx file
    }

    // Contains all the stages in this pipeline
    stages {
        stage('1.Environment') {  // First stage: Environment Setup
            steps {
                sh 'pwd && ls -alh'  // Print the current working directory and list all files in detailed format
                sh 'printenv'  // Print all the environment variables available on the Jenkins agent
                sh 'docker version'  // Check the Docker version to verify Docker is correctly installed
                sh 'git --version'  // Check Git version to verify Git is correctly installed
            }
        }

        stage('2.Compile') {  // Second stage: Compile the application
            agent {
                docker {  // Use a Docker agent with the specified image
                    image 'node:18-alpine'  // Specifies the Docker image to use for this stage
                }
            }
            steps {
                sh 'pwd && ls -alh'  // Print the current directory and list files to debug path issues
                sh 'node -v'  // Display Node.js version to verify the correct node environment
            }
        }

        stage('3.Build') {  // Third stage: Build the Docker image
            steps {
                sh 'pwd && ls -alh'  // Print the current directory and list files for debugging
                sh 'docker build -t ${IMAGE_NAME} .'  // Build Docker image using the Dockerfile in the current directory
            }
        }

        stage('4.Deploy') {  // Fourth stage: Deploy the application
            steps {
                // Debugging command to print current directory and list files
                sh 'pwd && ls -alh'  

                // Cleanup old containers and dangling images to prevent conflicts and save space
                sh '''
                docker rm -f ${IMAGE_NAME} || true
                docker rmi $(docker images -q -f dangling=true) || true
                '''

                // Check if the Docker network exists and create it if it does not
                sh '''
                if ! docker network ls | grep -q ${NETWORK}; then
                    echo "Creating Docker network: ${NETWORK}"
                    docker network create ${NETWORK}
                else
                    echo "INFO: Docker network ${NETWORK} already exists"
                fi
                '''

                // Run the Docker container with network connection and volume mapping
                sh """
                    docker run -d --network ${NETWORK} -p 32779:80 --name ${IMAGE_NAME} \
                    -v /www/docker/${NGINX}/${NGINX}.conf:/etc/nginx/nginx.conf \
                    ${IMAGE_NAME}
                """
            }
        }
    }
}
