aws_region         = "us-east-1"
vpc_name           = "devops-vpc"
vpc_cidr           = "10.0.0.0/16"

availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

public_subnets     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
private_subnets    = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

cluster_name       = "DevOps-cluster"
cluster_version    = "1.29"
node_group_name    = "devops-ng"

desired_capacity   = 2
min_capacity       = 1
max_capacity       = 3
instance_types     = ["t3.medium"]

tags = {
  Project     = "DevOps-EKS"
  Environment = "dev"
}

public_key_path = "./Dev-hack.pub"
