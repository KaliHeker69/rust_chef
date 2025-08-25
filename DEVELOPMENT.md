# RustChef Development Guide

This guide provides detailed information for developers working on RustChef.

## 🏗️ Architecture Overview

RustChef consists of three main components:

### 1. Backend (Rust + Axum)
- **Purpose**: High-performance API server
- **Location**: `backend/`
- **Responsibilities**:
  - Serve REST API endpoints
  - Execute data transformation operations
  - Serve static frontend files
  - Handle CORS and security

### 2. WebAssembly Module (Rust → WASM)
- **Purpose**: Browser-side operation execution
- **Location**: `wasm/`
- **Responsibilities**:
  - Run operations directly in the browser
  - Provide instant feedback for small data
  - Reduce server load
  - Enable offline functionality

### 3. Frontend (React + TypeScript)
- **Purpose**: User interface
- **Location**: `frontend/`
- **Responsibilities**:
  - Provide intuitive UI for operations
  - Manage operation recipes
  - Handle file uploads/downloads
  - Theme management

## 🔧 Development Workflow

### Initial Setup

1. **Install Prerequisites**:
   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Install wasm-pack
   cargo install wasm-pack
   
   # Install Node.js (use your preferred method)
   # macOS: brew install node
   # Ubuntu: sudo apt install nodejs npm
   ```

2. **Clone and Build**:
   ```bash
   git clone <repository-url>
   cd rust_chef
   ./build.sh
   ```

### Development Server

For active development, use the development script:

```bash
./dev.sh
```

This will:
- Start the backend on `http://localhost:8080`
- Start the frontend dev server on `http://localhost:3000`
- Enable hot reloading for both components

### Manual Development

If you prefer manual control:

```bash
# Terminal 1: Backend
cd backend
cargo run

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: WASM (when making changes)
cd wasm
wasm-pack build --target web
```

## 📊 Performance Considerations

### Backend Performance

1. **Use `&str` over `String` when possible**:
   ```rust
   // Good
   pub fn process_text(input: &str) -> Result<String>
   
   // Avoid
   pub fn process_text(input: String) -> Result<String>
   ```

2. **Minimize allocations in hot paths**:
   ```rust
   // Good - reuse buffer
   let mut buffer = Vec::with_capacity(input.len());
   
   // Avoid - multiple allocations
   let result = input.chars().map(|c| process(c)).collect::<String>();
   ```

3. **Use appropriate data structures**:
   ```rust
   // For frequent lookups
   use std::collections::HashMap;
   
   // For ordered data
   use std::collections::BTreeMap;
   ```

### WASM Performance

1. **Minimize string passing between JS and WASM**:
   ```rust
   // Good - process in chunks
   #[wasm_bindgen]
   pub fn process_chunk(data: &[u8]) -> Vec<u8>
   
   // Avoid - frequent small calls
   #[wasm_bindgen]
   pub fn process_char(c: char) -> char
   ```

2. **Use appropriate WASM types**:
   ```rust
   // Good
   #[wasm_bindgen]
   pub fn hash_bytes(data: &[u8]) -> String
   
   // Less efficient
   #[wasm_bindgen]
   pub fn hash_string(data: String) -> String
   ```

### Frontend Performance

1. **Use React.memo for expensive components**:
   ```typescript
   const OperationsList = React.memo(({ operations, onSelect }) => {
     // Component implementation
   });
   ```

2. **Debounce expensive operations**:
   ```typescript
   const debouncedSearch = useMemo(
     () => debounce(searchOperations, 300),
     []
   );
   ```

## 🧪 Testing Strategy

### Unit Tests

**Backend**:
```bash
cd backend
cargo test
```

Test structure:
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_base64_encode_decode() {
        let input = "Hello, World!";
        let encoded = base64_encode(input).unwrap();
        let decoded = base64_decode(&encoded).unwrap();
        assert_eq!(input, decoded);
    }
}
```

**WASM**:
```bash
cd wasm
wasm-pack test --chrome --headless
```

**Frontend**:
```bash
cd frontend
npm test
```

### Integration Tests

Create integration tests in `backend/tests/`:

```rust
use axum::http::StatusCode;
use serde_json::json;

#[tokio::test]
async fn test_execute_operation() {
    let app = create_app();
    
    let response = app
        .oneshot(
            Request::builder()
                .method(http::Method::POST)
                .uri("/api/execute")
                .header(http::header::CONTENT_TYPE, mime::APPLICATION_JSON.as_ref())
                .body(Body::from(
                    serde_json::to_vec(&json!({
                        "operation": "base64_encode",
                        "input": "Hello"
                    })).unwrap(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}
```

## 🔍 Debugging

### Backend Debugging

1. **Enable debug logging**:
   ```bash
   RUST_LOG=debug cargo run
   ```

2. **Use the `dbg!` macro**:
   ```rust
   let result = some_operation(input);
   dbg!(&result);
   ```

3. **Conditional compilation for debug builds**:
   ```rust
   #[cfg(debug_assertions)]
   eprintln!("Debug info: {:?}", data);
   ```

### WASM Debugging

1. **Use console logging**:
   ```rust
   use web_sys::console;
   
   console::log_1(&"Debug message".into());
   ```

2. **Enable debug symbols**:
   ```bash
   wasm-pack build --dev --target web
   ```

### Frontend Debugging

1. **React Developer Tools**: Install the browser extension

2. **Console debugging**:
   ```typescript
   console.log('Operation result:', result);
   console.time('operation-duration');
   // ... operation code
   console.timeEnd('operation-duration');
   ```

## 📦 Building for Production

### Full Production Build

```bash
./build.sh
```

This creates optimized builds:
- Backend: `backend/target/release/rust_chef_backend`
- WASM: `wasm/pkg/`
- Frontend: `frontend/dist/`

### Individual Component Builds

```bash
# Backend only
./build.sh backend

# WASM only
./build.sh wasm

# Frontend only
./build.sh frontend
```

### Deployment

1. **Backend**: Deploy the binary and ensure it can serve static files from `frontend/dist/`

2. **Static hosting**: Deploy `frontend/dist/` to any static hosting service

3. **Docker** (optional):
   ```dockerfile
   FROM rust:1.75 as backend-builder
   WORKDIR /app
   COPY backend/ .
   RUN cargo build --release

   FROM node:18 as frontend-builder
   WORKDIR /app
   COPY frontend/ .
   RUN npm install && npm run build

   FROM debian:bookworm-slim
   COPY --from=backend-builder /app/target/release/rust_chef_backend /usr/local/bin/
   COPY --from=frontend-builder /app/dist /var/www/
   EXPOSE 8080
   CMD ["rust_chef_backend"]
   ```

## 🛠️ Adding New Features

### Adding a New Operation Category

1. **Create new module** in `backend/src/operations/`
2. **Add to mod.rs**:
   ```rust
   pub mod network;
   pub use network::*;
   ```

3. **Update main.rs** with new operations
4. **Add WASM bindings** if needed
5. **Update frontend** categories if required

### Adding Configuration

1. **Backend configuration**:
   ```rust
   use clap::Parser;

   #[derive(Parser)]
   struct Config {
       #[arg(long, default_value = "8080")]
       port: u16,
       
       #[arg(long, default_value = "127.0.0.1")]
       host: String,
   }
   ```

2. **Environment variables**:
   ```rust
   use std::env;

   let port = env::var("PORT")
       .unwrap_or_else(|_| "8080".to_string())
       .parse::<u16>()
       .expect("Invalid port");
   ```

### Adding Database Support

If you need to add database support:

1. **Add dependencies**:
   ```toml
   [dependencies]
   sqlx = { version = "0.7", features = ["runtime-tokio-rustls", "sqlite"] }
   ```

2. **Create database module**:
   ```rust
   // backend/src/database.rs
   use sqlx::SqlitePool;

   pub async fn create_pool() -> Result<SqlitePool, sqlx::Error> {
       SqlitePool::connect("sqlite:rustchef.db").await
   }
   ```

## 🔐 Security Considerations

### Input Validation

Always validate user inputs:

```rust
pub fn safe_decode(input: &str) -> Result<String, anyhow::Error> {
    if input.len() > MAX_INPUT_SIZE {
        return Err(anyhow::anyhow!("Input too large"));
    }
    
    // Validate input format
    if !is_valid_format(input) {
        return Err(anyhow::anyhow!("Invalid input format"));
    }
    
    // Process input
    decode_implementation(input)
}
```

### Rate Limiting

Consider adding rate limiting for production:

```rust
use tower::limit::RateLimitLayer;
use std::time::Duration;

let app = Router::new()
    .route("/api/execute", post(execute_operation))
    .layer(RateLimitLayer::new(10, Duration::from_secs(1)));
```

### CORS Configuration

For production, configure CORS properly:

```rust
use tower_http::cors::{CorsLayer, Any};

let cors = CorsLayer::new()
    .allow_origin("https://yourdomain.com".parse::<HeaderValue>().unwrap())
    .allow_methods([Method::GET, Method::POST])
    .allow_headers(Any);
```

## 📈 Monitoring and Metrics

### Logging

Use structured logging:

```rust
use tracing::{info, warn, error, instrument};

#[instrument]
pub async fn execute_operation(request: OperationRequest) -> Result<OperationResponse> {
    info!("Executing operation: {}", request.operation);
    
    let start = std::time::Instant::now();
    let result = perform_operation(&request).await;
    let duration = start.elapsed();
    
    info!("Operation completed in {:?}", duration);
    result
}
```

### Metrics

Add metrics collection:

```rust
use prometheus::{Counter, Histogram, register_counter, register_histogram};

lazy_static! {
    static ref OPERATION_COUNTER: Counter = register_counter!(
        "operations_total", "Total number of operations executed"
    ).unwrap();
    
    static ref OPERATION_DURATION: Histogram = register_histogram!(
        "operation_duration_seconds", "Operation execution time"
    ).unwrap();
}
```

This development guide should help you understand and contribute to RustChef effectively. For questions or clarifications, please refer to the main README.md or open an issue.
