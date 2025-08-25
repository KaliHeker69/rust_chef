#!/bin/bash

# RustChef Development Server Script
echo "🚀 Starting RustChef development servers..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[DEV]${NC} $1"
}

# Check if tmux is available for better session management
if command -v tmux &> /dev/null; then
    print_info "Starting development servers in tmux session..."
    
    # Create new tmux session
    tmux new-session -d -s rustchef
    
    # Start backend in first window
    tmux send-keys -t rustchef "cd backend && cargo run" Enter
    tmux rename-window -t rustchef "backend"
    
    # Create new window for frontend
    tmux new-window -t rustchef -n "frontend"
    tmux send-keys -t rustchef:frontend "cd frontend && npm run dev" Enter
    
    # Create new window for logs/commands
    tmux new-window -t rustchef -n "commands"
    tmux send-keys -t rustchef:commands "echo 'RustChef Development Environment'" Enter
    tmux send-keys -t rustchef:commands "echo 'Backend: http://localhost:8080'" Enter
    tmux send-keys -t rustchef:commands "echo 'Frontend: http://localhost:3000'" Enter
    tmux send-keys -t rustchef:commands "echo 'Use Ctrl+B then D to detach from this session'" Enter
    
    # Attach to the session
    tmux attach-session -t rustchef
    
else
    print_warning "tmux not found. Starting servers in background..."
    print_info "Starting backend server..."
    cd backend
    cargo run &
    BACKEND_PID=$!
    cd ..
    
    print_info "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_status "Servers started!"
    echo "Backend: http://localhost:8080"
    echo "Frontend: http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop all servers"
    
    # Wait for interrupt
    trap 'kill $BACKEND_PID $FRONTEND_PID; exit' INT
    wait
fi
