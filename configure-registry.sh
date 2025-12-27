#!/bin/bash
# Configure Docker for insecure registry
echo '{"insecure-registries":["192.168.56.101:5000"]}' | sudo tee /etc/docker/daemon.json
sudo systemctl restart docker
sleep 10
docker pull 192.168.56.101:5000/quickvote/backend:latest
echo "Registry configuration complete!"
