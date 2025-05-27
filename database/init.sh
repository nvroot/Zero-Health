#!/bin/bash

# Deliberately weak database initialization script
echo "Initializing Zero Health database..."

# Create database with weak security
PGPASSWORD=postgres psql -U postgres -h localhost -c "CREATE DATABASE zero_health;"

# Run initialization script
PGPASSWORD=postgres psql -U postgres -h localhost -d zero_health -f init.sql

echo "Database initialized with deliberately weak security configurations!"
echo "Warning: This database is intentionally vulnerable and should only be used for educational purposes." 