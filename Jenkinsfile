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
   
