#!/usr/bin/env node

console.log(`
🤖 Zero Health LLM Configuration Setup
=====================================

This application now uses an LLM for dynamic responses instead of hardcoded replies.

CONFIGURATION OPTIONS:

1. OpenAI API (Recommended for testing):
   export OPENAI_API_KEY="your-api-key-here"
   export OPENAI_MODEL="gpt-3.5-turbo"
   export OPENAI_BASE_URL="https://api.openai.com/v1"

2. Local LLM with LM Studio:
   - Download and install LM Studio
   - Start local server on port 1234
   export OPENAI_API_KEY="lm-studio"
   export OPENAI_MODEL="your-local-model"
   export OPENAI_BASE_URL="http://localhost:1234/v1"

3. Groq API (Fast inference):
   export OPENAI_API_KEY="your-groq-api-key"
   export OPENAI_MODEL="llama3-8b-8192"
   export OPENAI_BASE_URL="https://api.groq.com/openai/v1"

4. Ollama (Local):
   export OPENAI_API_KEY="ollama"
   export OPENAI_MODEL="llama3"
   export OPENAI_BASE_URL="http://localhost:11434/v1"

SECURITY NOTE:
This LLM integration includes deliberate vulnerabilities for educational purposes:
- LLM-generated SQL queries executed without validation
- Prompt injection vulnerabilities
- Information disclosure through error messages
- Insufficient access controls on LLM-generated content

TESTING WITHOUT LLM:
If no valid LLM is configured, the chatbot will return fallback error messages
that still demonstrate some vulnerabilities.

After setting environment variables, restart the containers:
docker-compose down && docker-compose up -d

For testing, you can also set these in docker-compose.yml environment section.
`);

process.exit(0); 