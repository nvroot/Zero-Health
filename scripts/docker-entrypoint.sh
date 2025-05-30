#!/bin/bash
set -e

echo "🚀 Zero Health Server Starting..."

# Function to wait for database to be ready
wait_for_db() {
    echo "⏳ Waiting for database to be ready..."
    until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
        echo "🔄 Database not ready yet, waiting 2 seconds..."
        sleep 2
    done
    echo "✅ Database is ready!"
}

# Function to initialize sample data
initialize_sample_data() {
    echo "📦 Initializing sample data..."
    
    # Check if marker file exists (indicates data was already initialized)
    if [ -f "/.sample-data-initialized" ]; then
        echo "✅ Sample data already initialized, skipping..."
        return 0
    fi
    
    # Run sample data initialization
    if node scripts/init-sample-data.js; then
        echo "✅ Sample data initialization completed successfully!"
        touch /.sample-data-initialized
    else
        echo "❌ Sample data initialization failed, but continuing server startup..."
    fi
}

# Function to start the server
start_server() {
    echo "🌐 Starting Zero Health server on port ${PORT:-5000}..."
    exec "$@"
}

# Main execution flow
main() {
    # Wait for database to be available
    wait_for_db
    
    # Initialize sample data if needed
    initialize_sample_data
    
    # Start the main server process
    start_server "$@"
}

# Run main function with all arguments
main "$@" 