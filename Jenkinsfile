@Library('shared') _

pipeline {
    agent any

    environment {
        // Update the main app image name to match the deployment file
        DOCKER_IMAGE_NAME = 'devshubh2204/easyshop-hack_app'
        DOCKER_MIGRATION_IMAGE_NAME = 'devshubh2204/easyshop-hack_migration'
        DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"
        GITHUB_CREDENTIALS = credentials('git-hub-cred')
        GIT_BRANCH = "shubu-feature-branch"
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                script {
                    clean_ws()
                }
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    clone("https://github.com/AWS-DevOps-shubh/easyshop-hack.git","shubu-feature-branch")
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Main App Image') {
                    steps {
                        script {
                            docker_build(
                                imageName: env.DOCKER_IMAGE_NAME,
                                imageTag: env.DOCKER_IMAGE_TAG,
                                dockerfile: 'Dockerfile',
                                context: '.'
                            )
                        }
                    }
                }

                stage('Build Migration Image') {
                    steps {
                        script {
                            docker_build(
                                imageName: env.DOCKER_MIGRATION_IMAGE_NAME,
                                imageTag: env.DOCKER_IMAGE_TAG,
                                dockerfile: 'scripts/Dockerfile.migration',
                                context: '.'
                            )
                        }
                    }
                }
            }
        }

        stage('Security Scan with Trivy') {
            steps {
                script {
                    // Create directory for results

                    trivy()

                }
            }
        }

        stage('Push Docker Images') {
            parallel {
                stage('Push Main App Image') {
                    steps {
                        script {
                            docker_push(
                                imageName: env.DOCKER_IMAGE_NAME,
                                imageTag: env.DOCKER_IMAGE_TAG,
                                credentials: 'docker-hub-cred'
                            )
                        }
                    }
                }

                stage('Push Migration Image') {
                    steps {
                        script {
                            docker_push(
                                imageName: env.DOCKER_MIGRATION_IMAGE_NAME,
                                imageTag: env.DOCKER_IMAGE_TAG,
                                credentials: 'docker-hub-cred'
                            )
                        }
                    }
                }
            }
        }

        // Add this new stage
        stage('Update Kubernetes Manifests') {
            steps {
                script {
                    update_k8s_manifests(
                        imageTag: env.DOCKER_IMAGE_TAG,
                        manifestsPath: 'K8s',
                        gitCredentials: 'git-hub-cred',
                        gitUserName: 'AWS-DevOps-shubh',
                        gitUserEmail: 'devshubh2204@gmail.com'
                    )
                }
            }
        }
    }
}
