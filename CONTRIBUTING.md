# Contributing to RustChef

Thank you for your interest in contributing to RustChef! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Rust (latest stable version)
- Node.js (v18 or higher)
- wasm-pack
- Git

### Development Setup

1. Fork and clone the repository:
```bash
git clone https://github.com/your-username/rust-chef.git
cd rust-chef
```

2. Install dependencies and build:
```bash
./build.sh
```

3. Start development servers:
```bash
./dev.sh
```

## 📁 Project Structure

```
rust_chef/
├── backend/          # Rust backend server (Axum)
│   ├── src/
│   │   ├── main.rs
│   │   └── operations/
├── wasm/            # WebAssembly module
│   ├── src/
│   └── Cargo.toml
├── frontend/        # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── build.sh         # Build script
├── dev.sh          # Development script
└── README.md
```

## 🛠️ Adding New Operations

### Backend Implementation

1. Add your operation to the appropriate module in `backend/src/operations/`:
   - `encoding.rs` - Encoding/decoding operations
   - `hashing.rs` - Hash functions
   - `crypto.rs` - Cryptographic operations
   - `text.rs` - Text manipulation
   - `data.rs` - Data processing

2. Add the operation to the `execute_operation` function in `main.rs`

3. Add operation metadata to the `get_operations` function

Example:
```rust
// In backend/src/operations/encoding.rs
pub fn base32_encode(input: &str) -> Result<String> {
    // Implementation here
    Ok(encoded_result)
}

// In backend/src/main.rs
"base32_encode" => encoding::base32_encode(&request.input),
```

### WASM Implementation

Add the same operation to `wasm/src/lib.rs` for browser-side execution:

```rust
#[wasm_bindgen]
pub fn base32_encode(input: &str) -> String {
    // Implementation here
}
```

### Frontend Integration

The frontend will automatically discover new operations from the backend API. No additional frontend code is needed for basic operations.

## 🧪 Testing

### Backend Tests

```bash
cd backend
cargo test
```

### WASM Tests

```bash
cd wasm
wasm-pack test --chrome --headless
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📝 Code Style

### Rust

- Use `rustfmt` for formatting: `cargo fmt`
- Use `clippy` for linting: `cargo clippy`
- Follow Rust naming conventions
- Add documentation for public functions

### TypeScript/React

- Use Prettier for formatting
- Follow React hooks best practices
- Use TypeScript strict mode
- Prefer functional components with hooks

## 🐛 Bug Reports

When reporting bugs, please include:

- OS and version
- Rust version (`rustc --version`)
- Node.js version (`node --version`)
- Steps to reproduce
- Expected vs actual behavior
- Console logs or error messages

## 💡 Feature Requests

Before submitting a feature request:

1. Check if it already exists in the issues
2. Explain the use case and benefit
3. Consider if it fits the project's scope
4. Provide implementation ideas if possible

## 📋 Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Add tests for new functionality
4. Update documentation if needed
5. Ensure all tests pass
6. Submit a pull request with a clear description

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added for new features
- [ ] Documentation updated
- [ ] No breaking changes (or clearly marked)

## 🏗️ Architecture Guidelines

### Performance

- Prioritize performance for data processing operations
- Use Rust's zero-cost abstractions
- Minimize allocations in hot paths
- Consider SIMD optimizations for large data

### Security

- Validate all user inputs
- Use secure defaults
- Avoid unsafe code unless necessary
- Be mindful of timing attacks

### UI/UX

- Maintain responsive design
- Provide clear error messages
- Support keyboard navigation
- Consider accessibility guidelines

## 📚 Resources

- [Rust Book](https://doc.rust-lang.org/book/)
- [Axum Documentation](https://docs.rs/axum/)
- [React Documentation](https://reactjs.org/docs/)
- [WebAssembly Book](https://rustwasm.github.io/docs/book/)

## 🤝 Community

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and experiences
- Follow the code of conduct

## 📄 License

By contributing to RustChef, you agree that your contributions will be licensed under the MIT License.
