#!/bin/bash
# Build and Push Script for Docker Swarm Registry
# This script builds all QuickVote images and pushes them to the local registry

set -e  # Exit on error

REGISTRY="192.168.56.101:5000"
PROJECT_DIR="$HOME/QuickVote-by-php-"

echo "========================================="
echo "Docker Swarm Image Build & Push Script"
echo "Registry: $REGISTRY"
echo "========================================="

cd "$PROJECT_DIR"

echo ""
echo "[1/4] Building and pushing Backend image..."
docker build -t $REGISTRY/quickvote/backend:latest -f backend/Dockerfile.prod backend/
docker push $REGISTRY/quickvote/backend:latest
echo "✓ Backend image pushed successfully"

echo ""
echo "[2/4] Building and pushing Frontend image..."
docker build -t $REGISTRY/quickvote/frontend:latest -f frontend/Dockerfile.prod frontend/
docker push $REGISTRY/quickvote/frontend:latest
echo "✓ Frontend image pushed successfully"

echo ""
echo "[3/4] Building and pushing Nginx image..."
docker build -t $REGISTRY/quickvote/nginx:latest -f nginx/Dockerfile nginx/
docker push $REGISTRY/quickvote/nginx:latest
echo "✓ Nginx image pushed successfully"

echo ""
echo "[4/4] Building and pushing Queue Worker image..."
docker build -t $REGISTRY/quickvote/queue-worker:latest -f queue-worker/Dockerfile queue-worker/
docker push $REGISTRY/quickvote/queue-worker:latest
echo "✓ Queue Worker image pushed successfully"

echo ""
echo "========================================="
echo "All images built and pushed successfully!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Verify images in registry: curl http://127.0.0.1:5000/v2/_catalog"
echo "2. Redeploy stack: docker stack deploy -c docker-compose.swarm.yml quickvote"
echo "3. Check services: docker service ls"
