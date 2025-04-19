module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"

  name = var.vpc_name
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  enable_dns_hostnames = true
  enable_dns_support   = true

  map_public_ip_on_launch = true

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = var.tags

  private_subnet_tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"           = "1"
  }

  public_subnet_tags = {
    "kubernetes.io/role/elb"                    = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}

module "eks_cluster" {
  source = "./modules/eks"

  cluster_name         = var.cluster_name
  subnet_ids           = module.vpc.private_subnets
  vpc_id               = module.vpc.vpc_id
  availability_zones   = var.availability_zones
  cluster_version      = var.cluster_version
  node_group_name      = var.node_group_name
  desired_capacity     = var.desired_capacity
  max_capacity         = var.max_capacity
  min_capacity         = var.min_capacity
  instance_types       = var.instance_types
  tags                 = var.tags
} 


module "ec2_instance" {
  source           = "./modules/ec2" # or "./modules/eks/ec2" if inside eks module
  instance_type    = "t2.large"
  key_name         = var.key_name
  public_key_path  = var.public_key_path
}