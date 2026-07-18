import re
from typing import Dict, Any

class UrgencyDetector:
    """
    Detect urgency level of complaints
    Calculates urgency score (0-100) based on multiple factors
    """
    
    def __init__(self):
        # Critical urgency keywords
        self.critical_keywords = [
            'emergency', 'urgent', 'immediate', 'asap', 'critical',
            'life threatening', 'danger', 'dangerous', 'accident',
            'injured', 'death', 'fire', 'explosion', 'collapse',
            'gas leak', 'electric shock', 'fatal'
        ]
        
        # High urgency keywords
        self.high_keywords = [
            'serious', 'severe', 'major', 'important', 'risk',
            'unsafe', 'health hazard', 'broken', 'not working',
            'flooding', 'overflow', 'blocked', 'leaking badly'
        ]
        
        # Medium urgency keywords
        self.medium_keywords = [
            'issue', 'problem', 'concern', 'needs attention',
            'should fix', 'maintenance', 'repair needed',
            'minor leak', 'slow drain'
        ]
        
        # Category-based urgency multipliers
        self.category_multipliers = {
            'electricity': 1.3,  # Higher risk
            'water_supply': 1.2,
            'roads': 1.1,
            'drainage': 1.2,
            'corruption': 1.4,
            'air_pollution': 1.1,
            'noise_pollution': 0.9,
            'parks_gardens': 0.8,
            'garbage': 1.0,
            'sanitation': 1.1,
            'street_lights': 0.9
        }
    
    def calculate_urgency(
        self,
        text: str,
        category: str,
        sentiment: str,
        location: Dict[str, Any]
    ) -> float:
        """
        Calculate urgency score (0-100)
        
        Args:
            text: Complaint text
            category: Complaint category
            sentiment: Sentiment analysis result
            location: Location information
        
        Returns:
            Urgency score (0-100)
        """
        text_lower = text.lower()
        urgency_score = 30  # Base score
        
        # 1. Keyword-based scoring (max +50 points)
        critical_matches = sum(1 for kw in self.critical_keywords if kw in text_lower)
        high_matches = sum(1 for kw in self.high_keywords if kw in text_lower)
        medium_matches = sum(1 for kw in self.medium_keywords if kw in text_lower)
        
        keyword_score = min(
            (critical_matches * 15) + (high_matches * 8) + (medium_matches * 3),
            50
        )
        urgency_score += keyword_score
        
        # 2. Sentiment-based adjustment (max +10 points)
        if sentiment == 'negative':
            urgency_score += 10
        elif sentiment == 'neutral':
            urgency_score += 5
        
        # 3. Category multiplier
        multiplier = self.category_multipliers.get(category, 1.0)
        urgency_score *= multiplier
        
        # 4. Text indicators
        # Caps lock usage (shouting)
        caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)
        if caps_ratio > 0.3:
            urgency_score += 5
        
        # Exclamation marks
        exclamation_count = text.count('!')
        urgency_score += min(exclamation_count * 2, 8)
        
        # Multiple urgent words in short text
        if len(text) < 200 and critical_matches >= 2:
            urgency_score += 10
        
        # 5. Time-sensitive words
        time_keywords = ['today', 'now', 'immediately', 'asap', 'right now', 'quickly']
        if any(kw in text_lower for kw in time_keywords):
            urgency_score += 8
        
        # Ensure score is within bounds
        urgency_score = max(min(urgency_score, 100), 0)
        
        return urgency_score
    
    def get_urgency_level(self, score: float) -> str:
        """
        Convert urgency score to level
        
        Args:
            score: Urgency score (0-100)
        
        Returns:
            Urgency level: 'critical', 'high', 'medium', or 'low'
        """
        if score >= 80:
            return 'critical'
        elif score >= 60:
            return 'high'
        elif score >= 40:
            return 'medium'
        else:
            return 'low'
    
    def get_recommended_sla(self, urgency_score: float) -> int:
        """
        Get recommended SLA (Service Level Agreement) in hours
        
        Args:
            urgency_score: Urgency score (0-100)
        
        Returns:
            Recommended resolution time in hours
        """
        if urgency_score >= 80:
            return 24  # 24 hours for critical
        elif urgency_score >= 60:
            return 72  # 3 days for high
        elif urgency_score >= 40:
            return 168  # 7 days for medium
        else:
            return 336  # 14 days for low
