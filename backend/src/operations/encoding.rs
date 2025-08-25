use anyhow::Result;
use base64::{engine::general_purpose::STANDARD, Engine};
use percent_encoding::{utf8_percent_encode, percent_decode_str, AsciiSet, CONTROLS};

const FRAGMENT: &AsciiSet = &CONTROLS.add(b' ').add(b'"').add(b'<').add(b'>').add(b'`');

pub fn base64_encode(input: &str) -> Result<String> {
    Ok(STANDARD.encode(input.as_bytes()))
}

pub fn base64_decode(input: &str) -> Result<String> {
    let decoded = STANDARD.decode(input.trim())?;
    Ok(String::from_utf8(decoded)?)
}

pub fn url_encode(input: &str) -> Result<String> {
    Ok(utf8_percent_encode(input, FRAGMENT).to_string())
}

pub fn url_decode(input: &str) -> Result<String> {
    Ok(percent_decode_str(input).decode_utf8()?.to_string())
}

pub fn html_encode(input: &str) -> Result<String> {
    let result = input
        .chars()
        .map(|c| match c {
            '<' => "&lt;".to_string(),
            '>' => "&gt;".to_string(),
            '&' => "&amp;".to_string(),
            '"' => "&quot;".to_string(),
            '\'' => "&#x27;".to_string(),
            _ => c.to_string(),
        })
        .collect();
    Ok(result)
}

pub fn html_decode(input: &str) -> Result<String> {
    let result = input
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&amp;", "&")
        .replace("&quot;", "\"")
        .replace("&#x27;", "'");
    Ok(result)
}

pub fn hex_encode(input: &str) -> Result<String> {
    Ok(hex::encode(input.as_bytes()))
}

pub fn hex_decode(input: &str) -> Result<String> {
    let decoded = hex::decode(input.trim())?;
    Ok(String::from_utf8(decoded)?)
}

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

    #[test]
    fn test_url_encode_decode() {
        let input = "Hello World & Friends";
        let encoded = url_encode(input).unwrap();
        let decoded = url_decode(&encoded).unwrap();
        assert_eq!(input, decoded);
    }

    #[test]
    fn test_hex_encode_decode() {
        let input = "Hello, World!";
        let encoded = hex_encode(input).unwrap();
        let decoded = hex_decode(&encoded).unwrap();
        assert_eq!(input, decoded);
    }
}
