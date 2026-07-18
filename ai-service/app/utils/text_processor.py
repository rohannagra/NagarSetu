import re
from typing import List
from collections import Counter

class TextProcessor:
    """
    Text processing utilities for NLP tasks
    """
    
    def __init__(self):
        # Abusive/offensive words list (simplified for demo)
        self.abusive_keywords = [
            'idiot', 'stupid', 'fool', 'moron', 'dumb', 'useless',
            'incompetent', 'corrupt', 'cheat', 'scam', 'fraud'
        ]
        
        # Stop words for keyword extraction
        self.stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
            'can', 'could', 'may', 'might', 'must', 'i', 'you', 'he', 'she', 'it',
            'we', 'they', 'this', 'that', 'these', 'those', 'am', 'there', 'here',
            'what', 'which', 'who', 'when', 'where', 'why', 'how', 'my', 'your',
            'his', 'her', 'its', 'our', 'their', 'me', 'him', 'us', 'them'
        }
    
    def clean_text(self, text: str) -> str:
        """
        Clean and normalize text
        
        Args:
            text: Raw text
        
        Returns:
            Cleaned text
        """
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www.\S+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^a-z0-9\s.,!?-]', '', text)
        
        return text.strip()
    
    def detect_language(self, text: str) -> str:
        """
        Detect language of text (simplified)
        
        Args:
            text: Text to analyze
        
        Returns:
            Language code ('en', 'hi', etc.)
        """
        try:
            from langdetect import detect
            return detect(text)
        except:
            # Default to English if detection fails
            return 'en'
    
    def generate_summary(self, text: str, max_length: int = 150) -> str:
        """
        Generate summary from text (extractive approach)
        
        Args:
            text: Text to summarize
            max_length: Maximum length of summary
        
        Returns:
            Summary text
        """
        # Split into sentences
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 10]
        
        if not sentences:
            return text[:max_length]
        
        # Score sentences based on keyword frequency
        word_freq = Counter()
        for sentence in sentences:
            words = [w for w in sentence.lower().split() if w not in self.stop_words]
            word_freq.update(words)
        
        # Score each sentence
        sentence_scores = []
        for sentence in sentences:
            words = [w for w in sentence.lower().split() if w not in self.stop_words]
            score = sum(word_freq[w] for w in words)
            sentence_scores.append((sentence, score))
        
        # Sort by score and take top sentences
        sentence_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Build summary
        summary = '. '.join([s[0] for s in sentence_scores[:2]])
        
        # Truncate if too long
        if len(summary) > max_length:
            summary = summary[:max_length] + '...'
        
        return summary
    
    def extract_keywords(self, text: str, top_n: int = 10) -> List[str]:
        """
        Extract important keywords from text
        
        Args:
            text: Text to analyze
            top_n: Number of keywords to return
        
        Returns:
            List of keywords
        """
        # Clean text
        text = self.clean_text(text)
        
        # Tokenize
        words = text.split()
        
        # Filter stop words and short words
        words = [
            w for w in words 
            if w not in self.stop_words and len(w) > 3
        ]
        
        # Count frequency
        word_freq = Counter(words)
        
        # Get top N
        keywords = [word for word, count in word_freq.most_common(top_n)]
        
        return keywords
    
    def detect_abusive_language(self, text: str) -> bool:
        """
        Detect if text contains abusive/offensive language
        
        Args:
            text: Text to check
        
        Returns:
            True if abusive language detected, False otherwise
        """
        text_lower = text.lower()
        
        for word in self.abusive_keywords:
            if word in text_lower:
                return True
        
        return False
    
    def extract_phone_numbers(self, text: str) -> List[str]:
        """
        Extract phone numbers from text
        
        Args:
            text: Text to search
        
        Returns:
            List of phone numbers found
        """
        # Indian phone number patterns
        patterns = [
            r'\b\d{10}\b',  # 10 digits
            r'\b\d{5}\s?\d{5}\b',  # 5+5 digits
            r'\+91\s?\d{10}\b',  # +91 prefix
            r'\b0\d{2,4}\s?\d{6,8}\b'  # Landline
        ]
        
        phones = []
        for pattern in patterns:
            phones.extend(re.findall(pattern, text))
        
        return list(set(phones))
    
    def extract_email_addresses(self, text: str) -> List[str]:
        """
        Extract email addresses from text
        
        Args:
            text: Text to search
        
        Returns:
            List of email addresses found
        """
        pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        return re.findall(pattern, text)
    
    def remove_pii(self, text: str) -> str:
        """
        Remove personally identifiable information from text
        
        Args:
            text: Text with potential PII
        
        Returns:
            Text with PII redacted
        """
        # Remove phone numbers
        text = re.sub(r'\b\d{10}\b', '[PHONE_REDACTED]', text)
        text = re.sub(r'\+91\s?\d{10}\b', '[PHONE_REDACTED]', text)
        
        # Remove email addresses
        text = re.sub(
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            '[EMAIL_REDACTED]',
            text
        )
        
        # Remove Aadhaar-like numbers (12 digits)
        text = re.sub(r'\b\d{12}\b', '[ID_REDACTED]', text)
        
        return text
