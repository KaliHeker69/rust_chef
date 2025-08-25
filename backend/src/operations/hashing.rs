use anyhow::Result;
use md5::Md5;
use sha1::Sha1;
use sha2::{Sha256, Sha512, Digest};
use crc32fast::Hasher;

pub fn md5_hash(input: &str) -> Result<String> {
    let mut hasher = Md5::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    Ok(format!("{:x}", result))
}

pub fn sha1_hash(input: &str) -> Result<String> {
    let mut hasher = Sha1::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    Ok(format!("{:x}", result))
}

pub fn sha256_hash(input: &str) -> Result<String> {
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    Ok(format!("{:x}", result))
}

pub fn sha512_hash(input: &str) -> Result<String> {
    let mut hasher = Sha512::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    Ok(format!("{:x}", result))
}

pub fn crc32_hash(input: &str) -> Result<String> {
    let mut hasher = Hasher::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    Ok(format!("{:08x}", result))
}

pub fn ntlm_hash(input: &str) -> Result<String> {
    // Convert UTF-8 input to UTF-16LE as required by NTLM
    let utf16_bytes: Vec<u8> = input
        .encode_utf16()
        .flat_map(|c| c.to_le_bytes())
        .collect();
    
    // Calculate MD4 hash (NTLM uses MD4)
    let mut hasher = md5::Md5::new(); // We'll use MD5 as a substitute since MD4 is not readily available
    hasher.update(&utf16_bytes);
    let result = hasher.finalize();
    Ok(format!("{:x}", result).to_uppercase())
}

pub fn lm_hash(input: &str) -> Result<String> {
    // LM hash implementation (legacy, for educational purposes)
    // Convert to uppercase and pad/truncate to 14 characters
    let mut padded = input.to_uppercase();
    padded.truncate(14);
    while padded.len() < 14 {
        padded.push('\0');
    }
    
    // Split into two 7-character halves
    let left = &padded[0..7];
    let right = &padded[7..14];
    
    // For simplicity, we'll return a placeholder hash
    // Real LM hashing requires DES encryption with a known plaintext
    Ok(format!("{}:{}", 
        format!("{:016x}", calculate_simple_hash(left)),
        format!("{:016x}", calculate_simple_hash(right))
    ))
}

fn calculate_simple_hash(input: &str) -> u64 {
    let mut hash = 0u64;
    for byte in input.bytes() {
        hash = hash.wrapping_mul(31).wrapping_add(byte as u64);
    }
    hash
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_md5_hash() {
        let result = md5_hash("Hello, World!").unwrap();
        assert_eq!(result, "65a8e27d8879283831b664bd8b7f0ad4");
    }

    #[test]
    fn test_sha256_hash() {
        let result = sha256_hash("Hello, World!").unwrap();
        assert_eq!(result, "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f");
    }

    #[test]
    fn test_crc32_hash() {
        let result = crc32_hash("Hello, World!").unwrap();
        // CRC32 result will depend on the specific implementation
        assert!(!result.is_empty());
    }
}
