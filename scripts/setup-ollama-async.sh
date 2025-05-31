#!/bin/bash

# Async Ollama setup script - runs in background
echo "🚀 Starting async Ollama model setup..."

OLLAMA_HOST=${OLLAMA_BASE_URL:-"http://ollama:11434"}
MODEL_NAME=${OLLAMA_MODEL:-"llama3.2:3b"}

# Wait for Ollama to be ready (with timeout)
echo "⏳ Waiting for Ollama service..."
for i in {1..60}; do
    if curl -s "$OLLAMA_HOST/api/version" > /dev/null 2>&1; then
        echo "✅ Ollama is ready!"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "❌ Timeout waiting for Ollama"
        exit 1
    fi
    sleep 2
done

# Check if model exists
echo "🔍 Checking for model '$MODEL_NAME'..."
if curl -s "$OLLAMA_HOST/api/tags" | grep -q "\"name\":\"$MODEL_NAME\""; then
    echo "✅ Model '$MODEL_NAME' already available!"
else
    echo "📥 Pulling model '$MODEL_NAME' (this may take a while)..."
    curl -s -X POST "$OLLAMA_HOST/api/pull" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"$MODEL_NAME\"}" > /dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Model '$MODEL_NAME' pulled successfully!"
    else
        echo "❌ Failed to pull model '$MODEL_NAME'"
        exit 1
    fi
fi

echo "🎉 Ollama setup complete!" 