variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
}

variable "cluster_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.29"
}

variable "subnet_ids" {
  description = "List of subnet IDs for the EKS cluster"
  type        = list(string)
}

variable "vpc_id" {
  description = "VPC ID for the EKS cluster"
  type        = string
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
}

variable "node_group_name" {
  description = "EKS Node Group name"
  type        = string
}

variable "desired_capacity" {
  description = "Desired node group capacity"
  type        = number
  default     = 2
}

variable "min_capacity" {
  description = "Minimum node group capacity"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum node group capacity"
  type        = number
  default     = 3
}

variable "instance_types" {
  description = "List of EC2 instance types for node group"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
