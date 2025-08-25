#!/bin/bash

# RustChef API Test Script
echo "🧪 Testing RustChef API..."

BASE_URL="http://127.0.0.1:8080"

# Test health check
echo "1. Testing health check..."
curl -s "$BASE_URL/"
echo ""

# Test operations list
echo "2. Testing operations list..."
curl -s "$BASE_URL/api/operations" | head -c 200
echo "..."
echo ""

# Test base64 encoding
echo "3. Testing base64 encoding..."
curl -s -X POST "$BASE_URL/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"operation": "base64_encode", "input": "Hello, RustChef!"}'
echo ""

# Test SHA256 hashing
echo "4. Testing SHA256 hashing..."
curl -s -X POST "$BASE_URL/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"operation": "sha256", "input": "Hello, World!"}'
echo ""

# Test Caesar cipher
echo "5. Testing Caesar cipher..."
curl -s -X POST "$BASE_URL/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"operation": "caesar_cipher", "input": "Hello", "parameters": {"shift": "3"}}'
echo ""

echo "✅ API tests completed!"
