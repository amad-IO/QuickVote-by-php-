#!/bin/bash
# Configure insecure registry on all nodes
cat > /etc/docker/daemon.json <<'EOF'
{
  "insecure-registries": ["192.168.56.101:5000"]
}
EOF

systemctl restart docker
echo "Docker configured and restarted successfully"
