# QuickVote Deployment Guide - Docker Swarm on Debian

Complete guide untuk deploy Quick_vote ke 4 mesin Debian dengan Docker Swarm.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Infrastructure Setup](#infrastructure-setup)
3. [Docker Swarm Setup](#docker-swarm-setup)
4. [Deployment](#deployment)
5. [Verification](#verification)
6. [Scaling](#scaling)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Hardware Requirements (Minimum)

**4 Debian Nodes** dengan spesifikasi berikut:

| Node | Role | CPU | Memory | Storage | Network |
|------|------|-----|--------|---------|---------|
| Node 0 (Manager) | Leader/Manager | 4 cores | 6 GB | 15 GB | 1 Gbps |
| Node 1 | Worker | 4 cores | 6 GB | 15 GB | 1 Gbps |
| Node 2 | Worker | 4 cores | 6 GB | 15 GB | 1 Gbps |
| Node 3 | Worker | 4 cores | 6 GB | 15 GB | 1 Gbps |

**Total**: 16 cores, 24 GB RAM, 60 GB storage

> **NOTE**: Untuk production dengan jutaan votes, gunakan **Recommended spec**: 32 cores total (8 per node), 48 GB RAM total (12 GB per node), 100 GB SSD storage

### Software Requirements

- **OS**: Debian 11/12 atau Ubuntu 20.04/22.04
- **Docker**: Version 20.10 atau lebih baru
- **Docker Compose**: Included in Docker Engine
- **Git**: Untuk clone repository
- **Apache Bench**: Untuk load testing (optional)

---

## Infrastructure Setup

### Step 1: Prepare All 4 Debian Machines

Jalankan command berikut di **SEMUA 4 NODES**:

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release git

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group (logout/login required after this)
sudo usermod -aG docker $USER

# Verify Docker installation
docker --version
```

### Step 2: Configure Network Firewall

```bash
# Docker Swarm ports
sudo ufw allow 2377/tcp  # Cluster management
sudo ufw allow 7946/tcp  # Node communication
sudo ufw allow 7946/udp  # Node communication
sudo ufw allow 4789/udp  # Overlay network
sudo ufw allow 80/tcp    # HTTP
sudo ufw enable
```

---

## Docker Swarm Setup

### Step 1: Initialize Swarm pada Manager Node

**Hanya di Node 0 (Manager)**:

```bash
# Get manager node IP
ip addr show

# Initialize swarm
docker swarm init --advertise-addr <MANAGER-IP>
```

### Step 2: Join Worker Nodes

**Jalankan di Node 1, 2, dan 3**:

```bash
docker swarm join --token SWMTKN-1-xxx <MANAGER-IP>:2377
```

### Step 3: Verify Cluster

```bash
docker node ls
```

### Step 4: Label Nodes

```bash
docker node update --label-add redis=cache node0
docker node update --label-add redis=queue node0
docker node update --label-add database=master node3
docker node update --label-add database=replica node1
docker node update --label-add database=replica node2
```

---

## Deployment

### Step 1: Clone dari GitHub

**Di Manager Node**:

```bash
cd ~
git clone https://github.com/your-username/Quick_vote.git quickvote
cd quickvote
```

### Step 2: Configure Environment

```bash
cd backend
cp ../.env.production .env
nano .env  # Update configuration
```

### Step 3: Deploy

```bash
cd ~/quickvote
chmod +x deploy.sh
./deploy.sh
```

---

## Verification

### Check Services

```bash
docker stack services quickvote
```

### Run Health Checks

```bash
./test-health.sh
```

### Access Application

- **Homepage**: `http://<MANAGER-IP>`
- **Security Test**: `http://<MANAGER-IP>/security-test.html` ✅

**File security-test.html sudah available di production dan dapat diakses langsung via browser!**

---

## Scaling

```bash
# Scale backend
./scale.sh backend 8

# Scale frontend  
./scale.sh frontend 10

# For extreme load
./scale.sh backend 20
./scale.sh queue-worker 10
```

---

## Load Testing

```bash
# Test with 5000 users
./test-load.sh --url http://<IP> --users 5000 --duration 300
```

---

**🎉 Deployment Complete!** 

QuickVote is now running with capability to handle **millions of votes**!
