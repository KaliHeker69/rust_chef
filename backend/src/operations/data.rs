use anyhow::Result;
use serde_json;

pub fn json_prettify(input: &str) -> Result<String> {
    let value: serde_json::Value = serde_json::from_str(input)?;
    Ok(serde_json::to_string_pretty(&value)?)
}

pub fn json_minify(input: &str) -> Result<String> {
    let value: serde_json::Value = serde_json::from_str(input)?;
    Ok(serde_json::to_string(&value)?)
}

pub fn json_validate(input: &str) -> Result<String> {
    match serde_json::from_str::<serde_json::Value>(input) {
        Ok(_) => Ok("Valid JSON".to_string()),
        Err(e) => Ok(format!("Invalid JSON: {}", e)),
    }
}

pub fn extract_urls(input: &str) -> Result<String> {
    let url_regex = regex::Regex::new(r"https?://[^\s]+").unwrap();
    let urls: Vec<&str> = url_regex.find_iter(input).map(|m| m.as_str()).collect();
    
    if urls.is_empty() {
        Ok("No URLs found".to_string())
    } else {
        Ok(urls.join("\n"))
    }
}

pub fn extract_emails(input: &str) -> Result<String> {
    let email_regex = regex::Regex::new(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b").unwrap();
    let emails: Vec<&str> = email_regex.find_iter(input).map(|m| m.as_str()).collect();
    
    if emails.is_empty() {
        Ok("No email addresses found".to_string())
    } else {
        Ok(emails.join("\n"))
    }
}

pub fn extract_ips(input: &str) -> Result<String> {
    let ip_regex = regex::Regex::new(r"\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b").unwrap();
    let ips: Vec<&str> = ip_regex.find_iter(input).map(|m| m.as_str()).collect();
    
    if ips.is_empty() {
        Ok("No IP addresses found".to_string())
    } else {
        Ok(ips.join("\n"))
    }
}

pub fn sort_lines(input: &str) -> Result<String> {
    let mut lines: Vec<&str> = input.lines().collect();
    lines.sort();
    Ok(lines.join("\n"))
}

pub fn unique_lines(input: &str) -> Result<String> {
    let mut lines: Vec<&str> = input.lines().collect();
    lines.sort();
    lines.dedup();
    Ok(lines.join("\n"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_json_prettify() {
        let input = r#"{"name":"John","age":30}"#;
        let result = json_prettify(input).unwrap();
        assert!(result.contains("  \"name\": \"John\""));
    }

    #[test]
    fn test_json_minify() {
        let input = r#"{
  "name": "John",
  "age": 30
}"#;
        let result = json_minify(input).unwrap();
        assert_eq!(result, r#"{"name":"John","age":30}"#);
    }

    #[test]
    fn test_extract_urls() {
        let input = "Check out https://example.com and http://test.org for more info";
        let result = extract_urls(input).unwrap();
        assert!(result.contains("https://example.com"));
        assert!(result.contains("http://test.org"));
    }

    #[test]
    fn test_extract_emails() {
        let input = "Contact us at info@example.com or support@test.org";
        let result = extract_emails(input).unwrap();
        assert!(result.contains("info@example.com"));
        assert!(result.contains("support@test.org"));
    }
}
