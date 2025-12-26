#!/bin/bash

########################################
# QuickVote Health Check Script
# Verifies all services are running correctly
########################################

set -e

STACK_NAME="quickvote"
BASE_URL="http://localhost"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}QuickVote Health Check${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

FAIL_COUNT=0

# Check Docker Swarm
print_info "Checking Docker Swarm..."
if docker info | grep -q "Swarm: active"; then
    print_pass "Docker Swarm is active"
else
    print_fail "Docker Swarm is not active"
    ((FAIL_COUNT++))
fi

# Check services
print_info "Checking service status..."
SERVICES=$(docker stack services $STACK_NAME --format "{{.Name}}" 2>/dev/null || echo "")

if [ -z "$SERVICES" ]; then
    print_fail "No services found for stack: $STACK_NAME"
    ((FAIL_COUNT++))
    exit 1
fi

while read -r service; do
    REPLICAS=$(docker service ls --filter "name=$service" --format "{{.Replicas}}")
    if [[ $REPLICAS == *"/"* ]]; then
        CURRENT=$(echo $REPLICAS | cut -d'/' -f1)
        DESIRED=$(echo $REPLICAS | cut -d'/' -f2)
        if [ "$CURRENT" == "$DESIRED" ]; then
            print_pass "$service: $REPLICAS"
        else
            print_fail "$service: $REPLICAS (not ready)"
            ((FAIL_COUNT++))
        fi
    fi
done <<< "$SERVICES"

# Check HTTP endpoints
echo ""
print_info "Testing HTTP endpoints..."

# Homepage
if curl -f -s -o /dev/null "$BASE_URL/"; then
    print_pass "GET $BASE_URL/ (homepage)"
else
    print_fail "GET $BASE_URL/ (homepage)"
    ((FAIL_COUNT++))
fi

# Health check
if curl -f -s -o /dev/null "$BASE_URL/health"; then
    print_pass "GET $BASE_URL/health"
else
    print_fail "GET $BASE_URL/health"
    ((FAIL_COUNT++))
fi

# API candidates
if curl -f -s -o /dev/null "$BASE_URL/api/candidates"; then
    print_pass "GET $BASE_URL/api/candidates"
else
    print_fail "GET $BASE_URL/api/candidates"
    ((FAIL_COUNT++))
fi

# API results
if curl -f -s -o /dev/null "$BASE_URL/api/results"; then
    print_pass "GET $BASE_URL/api/results"
else
    print_fail "GET $BASE_URL/api/results"
    ((FAIL_COUNT++))
fi

# Security test page
if curl -f -s -o /dev/null "$BASE_URL/security-test.html"; then
    print_pass "GET $BASE_URL/security-test.html"
else
    print_fail "GET $BASE_URL/security-test.html"
    ((FAIL_COUNT++))
fi

echo ""
echo -e "${GREEN}========================================${NC}"
if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}All checks passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}$FAIL_COUNT check(s) failed ✗${NC}"
    exit 1
fi
