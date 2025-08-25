#!/bin/bash

# RustChef Build Script
echo "🦀 Building RustChef..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v cargo &> /dev/null; then
        print_error "Rust/Cargo is not installed. Please install Rust from https://rustup.rs/"
        exit 1
    fi
    
    if ! command -v wasm-pack &> /dev/null; then
        print_warning "wasm-pack not found. Installing..."
        cargo install wasm-pack
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js from https://nodejs.org/"
        exit 1
    fi
    
    print_status "All dependencies are available!"
}

# Build backend
build_backend() {
    print_status "Building Rust backend..."
    cd backend
    cargo build --release
    if [ $? -ne 0 ]; then
        print_error "Backend build failed!"
        exit 1
    fi
    cd ..
    print_status "Backend built successfully!"
}

# Build WASM module
build_wasm() {
    print_status "Building WebAssembly module..."
    cd wasm
    wasm-pack build --target web --out-dir pkg
    if [ $? -ne 0 ]; then
        print_error "WASM build failed!"
        exit 1
    fi
    cd ..
    print_status "WASM module built successfully!"
}

# Build frontend
build_frontend() {
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    if [ $? -ne 0 ]; then
        print_error "Frontend dependency installation failed!"
        exit 1
    fi
    
    print_status "Building frontend..."
    npm run build
    if [ $? -ne 0 ]; then
        print_error "Frontend build failed!"
        exit 1
    fi
    cd ..
    print_status "Frontend built successfully!"
}

# Main build process
main() {
    check_dependencies
    build_backend
    build_wasm
    build_frontend
    
    print_status "🎉 RustChef build completed successfully!"
    echo ""
    print_status "To run the application:"
    echo "  1. Start the backend: cd backend && cargo run --release"
    echo "  2. Open http://localhost:8080 in your browser"
    echo ""
    print_status "For development:"
    echo "  1. Start backend: cd backend && cargo run"
    echo "  2. Start frontend: cd frontend && npm run dev"
    echo "  3. Open http://localhost:3000 in your browser"
}

# Parse command line arguments
case "$1" in
    "backend")
        build_backend
        ;;
    "wasm")
        build_wasm
        ;;
    "frontend")
        build_frontend
        ;;
    *)
        main
        ;;
esac
