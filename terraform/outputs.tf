output "eks_cluster_name" {
  value = module.eks_cluster.cluster_name
}

output "eks_cluster_endpoint" {
  value = module.eks_cluster.cluster_endpoint
}

output "eks_cluster_ca" {
  value = module.eks_cluster.cluster_certificate_authority
}

output "node_group_name" {
  value = module.eks_cluster.node_group_name
}
