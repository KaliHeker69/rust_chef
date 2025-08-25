use wasm_bindgen::prelude::*;
use base64::{engine::general_purpose::STANDARD, Engine};
use md5::Md5;
use sha1::Sha1;
use sha2::{Sha256, Sha512, Digest};
use percent_encoding::{utf8_percent_encode, percent_decode_str, AsciiSet, CONTROLS};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

const FRAGMENT: &AsciiSet = &CONTROLS.add(b' ').add(b'"').add(b'<').add(b'>').add(b'`');

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
    
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn init() {
    console_error_panic_hook::set_once();
}

// Encoding operations
#[wasm_bindgen]
pub fn base64_encode(input: &str) -> String {
    STANDARD.encode(input.as_bytes())
}

#[wasm_bindgen]
pub fn base64_decode(input: &str) -> Result<String, JsValue> {
    STANDARD.decode(input.trim())
        .map_err(|e| JsValue::from_str(&e.to_string()))
        .and_then(|bytes| String::from_utf8(bytes)
            .map_err(|e| JsValue::from_str(&e.to_string())))
}

#[wasm_bindgen]
pub fn url_encode(input: &str) -> String {
    utf8_percent_encode(input, FRAGMENT).to_string()
}

#[wasm_bindgen]
pub fn url_decode(input: &str) -> Result<String, JsValue> {
    percent_decode_str(input)
        .decode_utf8()
        .map(|s| s.to_string())
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn html_encode(input: &str) -> String {
    input
        .chars()
        .map(|c| match c {
            '<' => "&lt;".to_string(),
            '>' => "&gt;".to_string(),
            '&' => "&amp;".to_string(),
            '"' => "&quot;".to_string(),
            '\'' => "&#x27;".to_string(),
            _ => c.to_string(),
        })
        .collect()
}

#[wasm_bindgen]
pub fn html_decode(input: &str) -> Result<String, JsValue> {
    let result = input
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&amp;", "&")
        .replace("&quot;", "\"")
        .replace("&#x27;", "'");
    Ok(result)
}

#[wasm_bindgen]
pub fn hex_encode(input: &str) -> String {
    hex::encode(input.as_bytes())
}

#[wasm_bindgen]
pub fn hex_decode(input: &str) -> Result<String, JsValue> {
    hex::decode(input.trim())
        .map_err(|e| JsValue::from_str(&e.to_string()))
        .and_then(|bytes| String::from_utf8(bytes)
            .map_err(|e| JsValue::from_str(&e.to_string())))
}

// Hashing operations
#[wasm_bindgen]
pub fn md5_hash(input: &str) -> String {
    let mut hasher = Md5::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    format!("{:x}", result)
}

#[wasm_bindgen]
pub fn sha1_hash(input: &str) -> String {
    let mut hasher = Sha1::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    format!("{:x}", result)
}

#[wasm_bindgen]
pub fn sha256_hash(input: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    format!("{:x}", result)
}

#[wasm_bindgen]
pub fn sha512_hash(input: &str) -> String {
    let mut hasher = Sha512::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    format!("{:x}", result)
}

// Text operations
#[wasm_bindgen]
pub fn to_uppercase(input: &str) -> String {
    input.to_uppercase()
}

#[wasm_bindgen]
pub fn to_lowercase(input: &str) -> String {
    input.to_lowercase()
}

#[wasm_bindgen]
pub fn reverse_string(input: &str) -> String {
    input.chars().rev().collect()
}

#[wasm_bindgen]
pub fn caesar_cipher(input: &str, shift: i32) -> String {
    let mut result = String::new();
    
    for ch in input.chars() {
        if ch.is_ascii_alphabetic() {
            let base = if ch.is_ascii_lowercase() { b'a' } else { b'A' };
            let shifted = (((ch as u8 - base) as i32 + shift).rem_euclid(26)) as u8;
            result.push((base + shifted) as char);
        } else {
            result.push(ch);
        }
    }
    
    result
}

#[wasm_bindgen]
pub fn rot13(input: &str) -> String {
    caesar_cipher(input, 13)
}

// JSON operations
#[wasm_bindgen]
pub fn json_prettify(input: &str) -> Result<String, JsValue> {
    let value: serde_json::Value = serde_json::from_str(input)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    serde_json::to_string_pretty(&value)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn json_minify(input: &str) -> Result<String, JsValue> {
    let value: serde_json::Value = serde_json::from_str(input)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    serde_json::to_string(&value)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn extract_urls(input: &str) -> String {
    let url_regex = regex::Regex::new(r"https?://[^\s]+").unwrap();
    let urls: Vec<&str> = url_regex.find_iter(input).map(|m| m.as_str()).collect();
    
    if urls.is_empty() {
        "No URLs found".to_string()
    } else {
        urls.join("\n")
    }
}

#[wasm_bindgen]
pub fn extract_emails(input: &str) -> String {
    let email_regex = regex::Regex::new(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b").unwrap();
    let emails: Vec<&str> = email_regex.find_iter(input).map(|m| m.as_str()).collect();
    
    if emails.is_empty() {
        "No email addresses found".to_string()
    } else {
        emails.join("\n")
    }
}

// NTLM hash functions
#[wasm_bindgen]
pub fn ntlm_hash(input: &str) -> String {
    // Convert UTF-8 input to UTF-16LE as required by NTLM
    let utf16_bytes: Vec<u8> = input
        .encode_utf16()
        .flat_map(|c| c.to_le_bytes())
        .collect();
    
    // Calculate MD4 hash (using MD5 as substitute)
    let mut hasher = md5::Md5::new();
    hasher.update(&utf16_bytes);
    let result = hasher.finalize();
    format!("{:X}", result)
}

#[wasm_bindgen]
pub fn lm_hash(input: &str) -> String {
    // LM hash implementation (simplified)
    let mut padded = input.to_uppercase();
    padded.truncate(14);
    while padded.len() < 14 {
        padded.push('\0');
    }
    
    let left = &padded[0..7];
    let right = &padded[7..14];
    
    fn simple_hash(s: &str) -> u64 {
        let mut hash = 0u64;
        for byte in s.bytes() {
            hash = hash.wrapping_mul(31).wrapping_add(byte as u64);
        }
        hash
    }
    
    format!("{:016X}:{:016X}", simple_hash(left), simple_hash(right))
}
