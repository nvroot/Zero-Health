#!/bin/bash
set -e

echo "🔄 Zero Health Database Reset Script"
echo "=====================================

⚠️  WARNING: This will completely reset your database and sample data!
📦 All existing data will be lost and replaced with fresh sample data.
"

# Function to confirm action
confirm_reset() {
    read -p "Are you sure you want to reset the database? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Database reset cancelled."
        exit 1
    fi
}

# Function to reset docker containers
reset_containers() {
    echo "🐳 Stopping and removing containers..."
    docker-compose down --volumes
    
    echo "🗑️ Removing sample data marker..."
    rm -f .sample-data-initialized
    
    echo "🔨 Rebuilding and starting containers..."
    docker-compose build --no-cache server
    docker-compose up -d
}

# Function to wait for services
wait_for_services() {
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Check if containers are running
    if ! docker-compose ps | grep -q "Up"; then
        echo "❌ Some containers failed to start. Check with: docker-compose logs"
        exit 1
    fi
    
    echo "✅ Services are running!"
}

# Function to display completion message
show_completion() {
    echo "
🎉 Database reset completed successfully!

📊 Fresh sample data has been added:
   📧 Patient login: patient@test.com / password123
   👩‍⚕️ Doctor login: doctor@test.com / password123

🌐 Access your app at: http://nc5.netbird.local:6001

📋 What was reset:
   • All database tables and data
   • Sample users (patient & doctors)
   • Medical records & prescriptions
   • Lab results & chat history
   • Docker volumes and containers

🔧 To view logs: docker-compose logs
📱 To view containers: docker-compose ps
"
}

# Main execution
main() {
    confirm_reset
    reset_containers
    wait_for_services
    show_completion
}

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose is not installed or not in PATH"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the Zero Health project root."
    exit 1
fi

# Run main function
main 