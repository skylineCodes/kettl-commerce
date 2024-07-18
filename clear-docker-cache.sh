#!/bin/bash

# Remove all stopped containers
docker container prune -f

# Remove all unused images
docker image prune -a -f

# Remove all unused volumes
docker volume prune -f

# Remove all unused networks
docker network prune -f

# Remove all unused objects, including volumes
docker system prune --volumes -f

echo "Docker cache cleared."

# Command to run
# chmod +x clear-docker-cache.sh
# ./clear-docker-cache.sh