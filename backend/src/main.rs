use axum::{
    extract::Query,
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tower_http::cors::CorsLayer;
use tower_http::services::ServeDir;
use tracing_subscriber;

mod operations;
use operations::*;

#[derive(Debug, Serialize, Deserialize)]
struct OperationRequest {
    operation: String,
    input: String,
    parameters: Option<HashMap<String, String>>,
}

#[derive(Debug, Serialize, Deserialize)]
struct OperationResponse {
    success: bool,
    output: Option<String>,
    error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct OperationInfo {
    name: String,
    category: String,
    description: String,
    parameters: Vec<ParameterInfo>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ParameterInfo {
    name: String,
    param_type: String,
    description: String,
    required: bool,
    default_value: Option<String>,
}

async fn get_operations() -> Json<Vec<OperationInfo>> {
    let operations = vec![
        // Encoding operations
        OperationInfo {
            name: "base64_encode".to_string(),
            category: "Encoding".to_string(),
            description: "Encode data to Base64".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "base64_decode".to_string(),
            category: "Encoding".to_string(),
            description: "Decode data from Base64".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "url_encode".to_string(),
            category: "Encoding".to_string(),
            description: "URL encode data".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "url_decode".to_string(),
            category: "Encoding".to_string(),
            description: "URL decode data".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "html_encode".to_string(),
            category: "Encoding".to_string(),
            description: "HTML entity encode".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "html_decode".to_string(),
            category: "Encoding".to_string(),
            description: "HTML entity decode".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "hex_encode".to_string(),
            category: "Encoding".to_string(),
            description: "Encode data to hexadecimal".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "hex_decode".to_string(),
            category: "Encoding".to_string(),
            description: "Decode data from hexadecimal".to_string(),
            parameters: vec![],
        },
        // Hashing operations
        OperationInfo {
            name: "md5".to_string(),
            category: "Hashing".to_string(),
            description: "Calculate MD5 hash".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "sha1".to_string(),
            category: "Hashing".to_string(),
            description: "Calculate SHA-1 hash".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "sha256".to_string(),
            category: "Hashing".to_string(),
            description: "Calculate SHA-256 hash".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "sha512".to_string(),
            category: "Hashing".to_string(),
            description: "Calculate SHA-512 hash".to_string(),
            parameters: vec![],
        },
        // Text operations
        OperationInfo {
            name: "to_uppercase".to_string(),
            category: "Text".to_string(),
            description: "Convert text to uppercase".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "to_lowercase".to_string(),
            category: "Text".to_string(),
            description: "Convert text to lowercase".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "reverse".to_string(),
            category: "Text".to_string(),
            description: "Reverse text".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "caesar_cipher".to_string(),
            category: "Crypto".to_string(),
            description: "Apply Caesar cipher".to_string(),
            parameters: vec![
                ParameterInfo {
                    name: "shift".to_string(),
                    param_type: "number".to_string(),
                    description: "Number of positions to shift".to_string(),
                    required: false,
                    default_value: Some("13".to_string()),
                },
            ],
        },
        OperationInfo {
            name: "rot13".to_string(),
            category: "Crypto".to_string(),
            description: "Apply ROT13 cipher".to_string(),
            parameters: vec![],
        },
        // Utility operations
        OperationInfo {
            name: "json_prettify".to_string(),
            category: "Data".to_string(),
            description: "Format JSON with proper indentation".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "json_minify".to_string(),
            category: "Data".to_string(),
            description: "Minify JSON by removing whitespace".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "crc32".to_string(),
            category: "Hashing".to_string(),
            description: "Calculate CRC32 checksum".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "ntlm_hash".to_string(),
            category: "Hashing".to_string(),
            description: "Calculate NTLM hash (Windows password hash)".to_string(),
            parameters: vec![],
        },
        OperationInfo {
            name: "lm_hash".to_string(),
            category: "Hashing".to_string(),
            description: "Calculate LM hash (Legacy Windows password hash)".to_string(),
            parameters: vec![],
        },
    ];

    Json(operations)
}

async fn execute_operation(Json(request): Json<OperationRequest>) -> Json<OperationResponse> {
    let result = match request.operation.as_str() {
        // Encoding operations
        "base64_encode" => encoding::base64_encode(&request.input),
        "base64_decode" => encoding::base64_decode(&request.input),
        "url_encode" => encoding::url_encode(&request.input),
        "url_decode" => encoding::url_decode(&request.input),
        "html_encode" => encoding::html_encode(&request.input),
        "html_decode" => encoding::html_decode(&request.input),
        "hex_encode" => encoding::hex_encode(&request.input),
        "hex_decode" => encoding::hex_decode(&request.input),
        
        // Hashing operations
        "md5" => hashing::md5_hash(&request.input),
        "sha1" => hashing::sha1_hash(&request.input),
        "sha256" => hashing::sha256_hash(&request.input),
        "sha512" => hashing::sha512_hash(&request.input),
        "crc32" => hashing::crc32_hash(&request.input),
        "ntlm_hash" => hashing::ntlm_hash(&request.input),
        "lm_hash" => hashing::lm_hash(&request.input),
        
        // Text operations
        "to_uppercase" => text::to_uppercase(&request.input),
        "to_lowercase" => text::to_lowercase(&request.input),
        "reverse" => text::reverse(&request.input),
        
        // Crypto operations
        "caesar_cipher" => {
            let shift = request.parameters
                .as_ref()
                .and_then(|p| p.get("shift"))
                .and_then(|s| s.parse::<i32>().ok())
                .unwrap_or(13);
            crypto::caesar_cipher(&request.input, shift)
        },
        "rot13" => crypto::rot13(&request.input),
        
        // Data operations
        "json_prettify" => data::json_prettify(&request.input),
        "json_minify" => data::json_minify(&request.input),
        
        _ => Err(anyhow::anyhow!("Unknown operation: {}", request.operation)),
    };

    match result {
        Ok(output) => Json(OperationResponse {
            success: true,
            output: Some(output),
            error: None,
        }),
        Err(err) => Json(OperationResponse {
            success: false,
            output: None,
            error: Some(err.to_string()),
        }),
    }
}

async fn health_check() -> &'static str {
    "RustChef Backend is running! 🦀🧑‍🍳"
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/", get(health_check))
        .route("/api/operations", get(get_operations))
        .route("/api/execute", post(execute_operation))
        .layer(CorsLayer::permissive())
        .nest_service("/static", ServeDir::new("../frontend/dist"));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080").await?;
    
    println!("🚀 RustChef backend starting on http://127.0.0.1:8080");
    println!("📚 API Documentation:");
    println!("   GET  /api/operations - List all available operations");
    println!("   POST /api/execute    - Execute an operation");
    
    axum::serve(listener, app).await?;

    Ok(())
}
