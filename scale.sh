#!/bin/bash

########################################
# QuickVote Service Scaling Script
# For Docker Swarm
########################################

set -e

STACK_NAME="quickvote"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if service name and replicas are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <service> <replicas>"
    echo ""
    echo "Available services:"
    echo "  frontend     - React frontend (current: 3)"
    echo "  backend      - Laravel API (current: 4)"
    echo "  queue-worker - Queue workers (current: 2)"
    echo ""
    echo "Examples:"
    echo "  $0 backend 8        - Scale backend to 8 replicas"
    echo "  $0 frontend 10      - Scale frontend to 10 replicas"
    echo "  $0 queue-worker 5   - Scale workers to 5 replicas"
    exit 1
fi

SERVICE=$1
REPLICAS=$2

print_status "Scaling ${STACK_NAME}_${SERVICE} to $REPLICAS replicas..."

docker service scale ${STACK_NAME}_${SERVICE}=$REPLICAS

print_success "Scaling initiated"

echo ""
print_status "Waiting for services to stabilize (10 seconds)..."
sleep 10

echo ""
print_status "Current service status:"
docker service ls --filter "name=${STACK_NAME}_${SERVICE}"

echo ""
print_status "Replica distribution:"
docker service ps ${STACK_NAME}_${SERVICE} --filter "desired-state=running"

echo ""
print_success "Scaling complete!"
