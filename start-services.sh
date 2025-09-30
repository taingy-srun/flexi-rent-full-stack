#!/bin/bash

echo "🚀 Starting Room Rental Microservices Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📋 Created .env file from .env.example"
fi

# Stop any existing containers
echo "🔄 Stopping existing containers..."
docker-compose down

# Build and start all services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

services=("api-gateway:8080" "user-service:8081" "property-service:8082" "booking-service:8083")

for service in "${services[@]}"; do
    service_name=$(echo $service | cut -d':' -f1)
    port=$(echo $service | cut -d':' -f2)

    if curl -f http://localhost:$port/actuator/health > /dev/null 2>&1; then
        echo "✅ $service_name is healthy"
    else
        echo "⚠️  $service_name may not be ready yet"
    fi
done

echo ""
echo "🎉 Application started successfully!"
echo ""
echo "📍 Service URLs:"
echo "   Frontend:        http://localhost:3000"
echo "   API Gateway:     http://localhost:8080"
echo "   User Service:    http://localhost:8081"
echo "   Property Service: http://localhost:8082"
echo "   Booking Service: http://localhost:8083"
echo ""
echo "🗄️  Database Connections:"
echo "   User DB:         localhost:5433"
echo "   Property DB:     localhost:5434"
echo "   Booking DB:      localhost:5435"
echo ""
echo "📝 To view logs: docker-compose logs -f [service-name]"
echo "🛑 To stop all services: docker-compose down"