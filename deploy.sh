#!/bin/bash

########################################
# QuickVote Docker Swarm Deployment Script
# For Debian/Ubuntu Linux
# 
# This script should be run on the LEADER/MANAGER node
########################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
STACK_NAME="quickvote"
COMPOSE_FILE="docker-compose.swarm.yml"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}QuickVote Docker Swarm Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${YELLOW}[INFO]${NC } $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
print_status "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi
print_success "Docker is installed"

# Check if Docker Swarm is initialized
print_status "Checking Docker Swarm status..."
if ! docker info | grep -q "Swarm: active"; then
    print_error "Docker Swarm is not initialized."
    echo ""
    echo "Please initialize Docker Swarm first with:"
    echo "  docker swarm init --advertise-addr <manager-ip>"
    echo ""
    echo "Then join worker nodes with:"
    echo "  docker swarm join-token worker"
    exit 1
fi
print_success "Docker Swarm is active"

# Check number of nodes
NODE_COUNT=$(docker node ls --format "{{.ID}}" | wc -l)
print_status "Swarm has $NODE_COUNT node(s)"

if [ "$NODE_COUNT" -lt 4 ]; then
    print_error "This deployment requires 4 nodes (1 manager + 3 workers)"
    echo "Current nodes:"
    docker node ls
    echo ""
    echo "Please add more worker nodes before deploying."
    exit 1
fi

# Label nodes for service placement
print_status "Checking node labels..."

# You may need to adjust these labels based on your actual node names
# Example: docker node update --label-add redis=cache node1
echo "Please ensure nodes are labeled correctly:"
echo "  Node 1 (Manager): docker node update --label-add redis=cache <node-name>"
echo "  Node 4 (Database): docker node update --label-add database=master <node-name>"
echo "  Other nodes: docker node update --label-add database=replica <node-name>"
echo ""
read -p "Have you labeled the nodes? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Please label nodes before continuing"
    exit 1
fi

# Build images (optional, or you can use pre-built images)
print_status "Building Docker images..."
docker build -t quickvote/nginx:latest ./nginx
docker build -t quickvote/backend:latest -f ./backend/Dockerfile.prod ./backend
docker build -t quickvote/frontend:latest -f ./frontend/Dockerfile.prod ./frontend

# Note: Queue worker image depends on backend, so it should be built after backend
print_success "Images built successfully"

# Deploy the stack
print_status "Deploying stack: $STACK_NAME..."
docker stack deploy -c $COMPOSE_FILE $STACK_NAME

print_success "Stack deployment initiated"
echo ""

# Wait for services to start
print_status "Waiting for services to start (30 seconds)..."
sleep 30

# Show service status
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Service Status${NC}"
echo -e "${GREEN}========================================${NC}"
docker stack services $STACK_NAME

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Service Distribution Across Nodes${NC}"
echo -e "${GREEN}========================================${NC}"
docker service ps $STACK_NAME --filter "desired-state=running"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Access your application at:"
echo "  http://<manager-ip>"
echo ""
echo "Security test page:"
echo "  http://<manager-ip>/security-test.html"
echo ""
echo "Useful commands:"
echo "  docker stack services $STACK_NAME     - View service status"
echo "  docker service logs -f $STACK_NAME\_backend  - View backend logs"
echo "  docker service scale $STACK_NAME\_backend=8  - Scale backend to 8 replicas"
echo "  docker stack rm $STACK_NAME           - Remove the stack"
echo ""
