#!/bin/bash

echo "🟡 Running Terraform..."
cd terraform
terraform init
terraform apply -auto-approve

echo "🟢 Getting EC2 IP from Terraform output..."
EC2_IP=$(terraform output -raw ec2_public_ip)

echo "🔵 Creating Ansible inventory.ini..."
cat <<EOF > ../ansible/inventory.ini
[jenkins]
$EC2_IP ansible_user=ubuntu ansible_ssh_private_key_file=../terraform/Dev-hack
EOF

echo "🟣 inventory.ini created with IP: $EC2_IP"

echo "🟠 Running Ansible Playbook..."
cd ../ansible
ansible-playbook -i inventory.ini jenkins.yml


