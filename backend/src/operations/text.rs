use anyhow::Result;

pub fn to_uppercase(input: &str) -> Result<String> {
    Ok(input.to_uppercase())
}

pub fn to_lowercase(input: &str) -> Result<String> {
    Ok(input.to_lowercase())
}

pub fn reverse(input: &str) -> Result<String> {
    Ok(input.chars().rev().collect())
}

pub fn count_characters(input: &str) -> Result<String> {
    Ok(format!("Characters: {}, Bytes: {}", input.chars().count(), input.len()))
}

pub fn count_words(input: &str) -> Result<String> {
    let word_count = input.split_whitespace().count();
    Ok(format!("Words: {}", word_count))
}

pub fn count_lines(input: &str) -> Result<String> {
    let line_count = input.lines().count();
    Ok(format!("Lines: {}", line_count))
}

pub fn remove_whitespace(input: &str) -> Result<String> {
    Ok(input.chars().filter(|c| !c.is_whitespace()).collect())
}

pub fn trim_whitespace(input: &str) -> Result<String> {
    Ok(input.trim().to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_to_uppercase() {
        let result = to_uppercase("hello world").unwrap();
        assert_eq!(result, "HELLO WORLD");
    }

    #[test]
    fn test_to_lowercase() {
        let result = to_lowercase("HELLO WORLD").unwrap();
        assert_eq!(result, "hello world");
    }

    #[test]
    fn test_reverse() {
        let result = reverse("hello").unwrap();
        assert_eq!(result, "olleh");
    }

    #[test]
    fn test_remove_whitespace() {
        let result = remove_whitespace("hello world test").unwrap();
        assert_eq!(result, "helloworldtest");
    }
}
