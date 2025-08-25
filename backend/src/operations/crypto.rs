use anyhow::Result;

pub fn caesar_cipher(input: &str, shift: i32) -> Result<String> {
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
    
    Ok(result)
}

pub fn rot13(input: &str) -> Result<String> {
    caesar_cipher(input, 13)
}

pub fn atbash_cipher(input: &str) -> Result<String> {
    let mut result = String::new();
    
    for ch in input.chars() {
        if ch.is_ascii_alphabetic() {
            let base = if ch.is_ascii_lowercase() { b'a' } else { b'A' };
            let pos = ch as u8 - base;
            let new_pos = 25 - pos;
            result.push((base + new_pos) as char);
        } else {
            result.push(ch);
        }
    }
    
    Ok(result)
}

pub fn reverse_words(input: &str) -> Result<String> {
    let words: Vec<&str> = input.split_whitespace().collect();
    let reversed: Vec<&str> = words.into_iter().rev().collect();
    Ok(reversed.join(" "))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_caesar_cipher() {
        let result = caesar_cipher("Hello", 3).unwrap();
        assert_eq!(result, "Khoor");
    }

    #[test]
    fn test_caesar_cipher_negative() {
        let result = caesar_cipher("Khoor", -3).unwrap();
        assert_eq!(result, "Hello");
    }

    #[test]
    fn test_rot13() {
        let result = rot13("Hello").unwrap();
        assert_eq!(result, "Uryyb");
        
        // ROT13 is its own inverse
        let double_rot = rot13(&result).unwrap();
        assert_eq!(double_rot, "Hello");
    }

    #[test]
    fn test_atbash_cipher() {
        let result = atbash_cipher("ABC").unwrap();
        assert_eq!(result, "ZYX");
        
        // Atbash is its own inverse
        let double_atbash = atbash_cipher(&result).unwrap();
        assert_eq!(double_atbash, "ABC");
    }
}
