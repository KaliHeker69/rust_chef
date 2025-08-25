# RustChef 🦀🧑‍🍳

A high-performance CyberChef clone built with Rust, featuring a modern web UI and blazing-fast data transformations.

## Features

- 🚀 **High Performance**: Built with Rust for maximum speed
- 🌐 **Modern Web UI**: React + TypeScript frontend with intuitive design
- ⚡ **WebAssembly**: Run operations directly in the browser for instant results
- 🔧 **Extensive Operations**: Comprehensive set of encoding, hashing, encryption, and data manipulation tools
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Beautiful UI**: Modern, clean interface with dark/light theme support

## Architecture

- **Backend**: Rust + Axum web server
- **Frontend**: React + TypeScript + Vite
- **WASM**: Rust compiled to WebAssembly for browser operations
- **Operations**: Modular operation system with easy extensibility

## Quick Start

### Prerequisites

- Rust (latest stable)
- Node.js (v18+)
- wasm-pack

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rust_chef
```

2. Install dependencies:
```bash
# Install Rust dependencies
cargo build

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. Build WASM module:
```bash
cd wasm
wasm-pack build --target web
cd ..
```

4. Start the development servers:
```bash
# Terminal 1: Start backend
cd backend
cargo run

# Terminal 2: Start frontend
cd frontend
npm run dev
```

## Operations Categories

### Encoding/Decoding
- Base64, Base32, Base16
- URL encoding/decoding
- HTML entity encoding/decoding
- Unicode operations

### Hashing
- MD5, SHA-1, SHA-256, SHA-512
- HMAC variants
- CRC32, Adler32

### Encryption/Decryption
- AES (various modes)
- RSA operations
- Caesar cipher
- ROT13

### Data Manipulation
- JSON formatting/minification
- XML formatting
- Text case transformations
- Regular expressions
- Data parsing and extraction

### Network
- IP address operations
- DNS lookups
- Port scanning utilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
