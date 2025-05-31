#!/bin/bash

# Setup script for Ollama - automatically pulls required model
echo "🚀 Setting up Ollama with required model..."

# Configuration
OLLAMA_HOST=${OLLAMA_BASE_URL:-"http://ollama:11434"}
MODEL_NAME=${OLLAMA_MODEL:-"llama3.2:3b"}
MAX_RETRIES=30
RETRY_DELAY=5

# Function to check if Ollama is ready
wait_for_ollama() {
    echo "⏳ Waiting for Ollama service to be ready..."
    local retries=0
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -s "$OLLAMA_HOST/api/version" > /dev/null 2>&1; then
            echo "✅ Ollama service is ready!"
            return 0
        fi
        
        retries=$((retries + 1))
        echo "   Attempt $retries/$MAX_RETRIES - Ollama not ready yet, waiting ${RETRY_DELAY}s..."
        sleep $RETRY_DELAY
    done
    
    echo "❌ Timeout waiting for Ollama service after $((MAX_RETRIES * RETRY_DELAY)) seconds"
    return 1
}

# Function to check if model is already available
check_model() {
    echo "🔍 Checking if model '$MODEL_NAME' is available..."
    if curl -s "$OLLAMA_HOST/api/tags" | grep -q "\"name\":\"$MODEL_NAME\""; then
        echo "✅ Model '$MODEL_NAME' is already available!"
        return 0
    else
        echo "📥 Model '$MODEL_NAME' not found, will download..."
        return 1
    fi
}

# Function to pull the model
pull_model() {
    echo "⬇️  Pulling model '$MODEL_NAME'..."
    echo "   This may take several minutes for the first time..."
    
    # Use curl to pull the model via Ollama API
    local pull_response
    pull_response=$(curl -s -X POST "$OLLAMA_HOST/api/pull" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"$MODEL_NAME\"}" 2>&1)
    
    if [ $? -eq 0 ]; then
        echo "✅ Model '$MODEL_NAME' pulled successfully!"
        return 0
    else
        echo "❌ Failed to pull model '$MODEL_NAME'"
        echo "Response: $pull_response"
        return 1
    fi
}

# Function to test the model
test_model() {
    echo "🧪 Testing model '$MODEL_NAME'..."
    
    local test_response
    test_response=$(curl -s -X POST "$OLLAMA_HOST/api/generate" \
        -H "Content-Type: application/json" \
        -d "{\"model\":\"$MODEL_NAME\",\"prompt\":\"Hello! Respond with just 'AI Ready'\",\"stream\":false}" 2>&1)
    
    if echo "$test_response" | grep -q "response"; then
        echo "✅ Model test successful!"
        echo "🤖 Ollama setup complete and ready for Zero Health!"
        return 0
    else
        echo "⚠️  Model test failed, but model was pulled"
        echo "Response: $test_response"
        return 1
    fi
}

# Main execution
main() {
    echo "🔧 Ollama Setup for Zero Health"
    echo "================================"
    echo "Model: $MODEL_NAME"
    echo "Host: $OLLAMA_HOST"
    echo ""
    
    # Wait for Ollama to be ready
    if ! wait_for_ollama; then
        exit 1
    fi
    
    # Check if model exists, if not pull it
    if ! check_model; then
        if ! pull_model; then
            echo "❌ Failed to set up Ollama model"
            exit 1
        fi
    fi
    
    # Test the model
    test_model
    
    echo ""
    echo "🎉 Ollama setup completed successfully!"
    echo "📝 Model '$MODEL_NAME' is ready for use"
    echo "🌐 API available at: $OLLAMA_HOST"
}

# Run main function
main "$@" 