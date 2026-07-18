import re
from typing import Tuple

class SentimentAnalyzer:
    """
    Sentiment analysis for complaints
    Rule-based approach with keyword matching
    Can be replaced with ML models (BERT, etc.) for production
    """
    
    def __init__(self):
        # Positive sentiment keywords
        self.positive_keywords = [
            'good', 'great', 'excellent', 'nice', 'helpful', 'thank',
            'appreciate', 'satisfied', 'happy', 'pleased', 'wonderful',
            'fantastic', 'amazing', 'perfect', 'love', 'best'
        ]
        
        # Negative sentiment keywords
        self.negative_keywords = [
            'bad', 'poor', 'terrible', 'worst', 'horrible', 'awful',
            'pathetic', 'useless', 'disgusting', 'hate', 'angry', 'frustrated',
            'disappointed', 'unsatisfied', 'unhappy', 'broken', 'damaged',
            'dirty', 'filthy', 'dangerous', 'unsafe', 'problem', 'issue',
            'complaint', 'not working', 'failed', 'delay', 'slow', 'never'
        ]
        
        # Urgency indicators (for negative sentiment)
        self.urgency_words = [
            'urgent', 'emergency', 'immediate', 'critical', 'serious',
            'danger', 'risk', 'life threatening', 'accident', 'injured'
        ]
    
    def analyze(self, text: str) -> Tuple[str, float]:
        """
        Analyze sentiment of text
        
        Args:
            text: Text to analyze
        
        Returns:
            Tuple of (sentiment_label, sentiment_score)
            sentiment_label: 'positive', 'negative', or 'neutral'
            sentiment_score: -1 to 1 (negative to positive)
        """
        if not text:
            return 'neutral', 0.0
        
        text_lower = text.lower()
        
        # Count positive and negative keywords
        positive_count = sum(1 for word in self.positive_keywords if word in text_lower)
        negative_count = sum(1 for word in self.negative_keywords if word in text_lower)
        urgency_count = sum(1 for word in self.urgency_words if word in text_lower)
        
        # Adjust negative score for urgency
        adjusted_negative = negative_count + (urgency_count * 1.5)
        
        # Calculate sentiment score
        total = positive_count + adjusted_negative
        if total == 0:
            # Default to negative for complaints
            sentiment_score = -0.3
        else:
            sentiment_score = (positive_count - adjusted_negative) / total
        
        # Determine label
        if sentiment_score > 0.2:
            sentiment_label = 'positive'
        elif sentiment_score < -0.2:
            sentiment_label = 'negative'
        else:
            sentiment_label = 'neutral'
        
        # Clamp score between -1 and 1
        sentiment_score = max(min(sentiment_score, 1.0), -1.0)
        
        return sentiment_label, sentiment_score
    
    def get_emotion_tags(self, text: str) -> list:
        """
        Extract emotion tags from text
        
        Args:
            text: Text to analyze
        
        Returns:
            List of emotion tags
        """
        text_lower = text.lower()
        emotions = []
        
        emotion_patterns = {
            'angry': ['angry', 'furious', 'rage', 'mad', 'annoyed'],
            'frustrated': ['frustrated', 'irritated', 'fed up'],
            'worried': ['worried', 'concerned', 'anxious', 'afraid'],
            'disappointed': ['disappointed', 'let down', 'unsatisfied'],
            'urgent': ['urgent', 'emergency', 'immediate', 'asap']
        }
        
        for emotion, keywords in emotion_patterns.items():
            if any(keyword in text_lower for keyword in keywords):
                emotions.append(emotion)
        
        return emotions
