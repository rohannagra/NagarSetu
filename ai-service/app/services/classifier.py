import re
from typing import Tuple

class ComplaintClassifier:
    """
    Complaint category and department classifier
    Uses rule-based classification with keyword matching
    Can be extended with ML models for production
    """
    
    def __init__(self):
        # Category keywords mapping
        self.category_keywords = {
            'roads': [
                'road', 'pothole', 'street', 'highway', 'pavement', 'footpath',
                'crack', 'broken road', 'road repair', 'traffic', 'divider',
                'speed breaker', 'zebra crossing', 'road marking'
            ],
            'electricity': [
                'electricity', 'power', 'light', 'transformer', 'wire', 'pole',
                'power cut', 'blackout', 'voltage', 'meter', 'electric bill',
                'current', 'short circuit', 'electric shock'
            ],
            'water_supply': [
                'water', 'supply', 'tap', 'pipeline', 'leakage', 'sewage',
                'contaminated water', 'water quality', 'water pressure',
                'water connection', 'bore well', 'water tank'
            ],
            'sanitation': [
                'sanitation', 'toilet', 'washroom', 'clean', 'hygiene',
                'public toilet', 'cleanliness', 'waste'
            ],
            'drainage': [
                'drain', 'drainage', 'sewer', 'overflow', 'blockage',
                'manhole', 'stagnant water', 'waterlogging', 'flooding'
            ],
            'street_lights': [
                'street light', 'lamp', 'lighting', 'dark', 'night',
                'light not working', 'bulb', 'street lamp'
            ],
            'garbage': [
                'garbage', 'waste', 'trash', 'dustbin', 'litter', 'dump',
                'garbage collection', 'waste disposal', 'plastic', 'rubbish'
            ],
            'public_transport': [
                'bus', 'train', 'metro', 'transport', 'auto', 'taxi',
                'bus stop', 'bus service', 'delay', 'overcrowding'
            ],
            'corruption': [
                'corruption', 'bribe', 'bribery', 'illegal', 'scam', 'fraud',
                'money demand', 'under table', 'kickback', 'embezzlement'
            ],
            'noise_pollution': [
                'noise', 'sound', 'loud', 'speaker', 'music', 'horn',
                'noise pollution', 'disturbance', 'loudspeaker'
            ],
            'air_pollution': [
                'air pollution', 'smoke', 'dust', 'pollution', 'emission',
                'factory smoke', 'air quality', 'smog', 'burning'
            ],
            'illegal_construction': [
                'illegal construction', 'unauthorized', 'building violation',
                'encroachment', 'illegal building', 'construction'
            ],
            'encroachment': [
                'encroachment', 'illegal occupation', 'land grabbing',
                'unauthorized occupation', 'squatter'
            ],
            'parks_gardens': [
                'park', 'garden', 'playground', 'green space', 'plants',
                'trees', 'maintenance', 'lawn'
            ]
        }
        
        # Department mapping
        self.department_mapping = {
            'roads': 'Public Works Department',
            'electricity': 'Electricity Board',
            'water_supply': 'Water Works Department',
            'sanitation': 'Health & Sanitation',
            'drainage': 'Public Works Department',
            'street_lights': 'Municipal Corporation',
            'garbage': 'Health & Sanitation',
            'public_transport': 'Transport Department',
            'corruption': 'Municipal Corporation',
            'noise_pollution': 'Pollution Control Board',
            'air_pollution': 'Pollution Control Board',
            'illegal_construction': 'Municipal Corporation',
            'encroachment': 'Municipal Corporation',
            'parks_gardens': 'Municipal Corporation'
        }
    
    def predict_category(self, text: str, hint_category: str = None) -> Tuple[str, float]:
        """
        Predict complaint category based on text
        
        Args:
            text: Complaint text (title + description)
            hint_category: Category hint from user
        
        Returns:
            Tuple of (predicted_category, confidence_score)
        """
        text_lower = text.lower()
        
        # If hint provided and matches keywords, use it with high confidence
        if hint_category and hint_category.lower() in self.category_keywords:
            keywords = self.category_keywords[hint_category.lower()]
            if any(keyword in text_lower for keyword in keywords):
                return hint_category, 0.95
        
        # Score each category
        category_scores = {}
        for category, keywords in self.category_keywords.items():
            score = 0
            for keyword in keywords:
                if keyword in text_lower:
                    # Weight longer keywords higher
                    weight = len(keyword.split())
                    score += weight
            category_scores[category] = score
        
        # Get best match
        if not category_scores or max(category_scores.values()) == 0:
            return 'other', 0.3
        
        best_category = max(category_scores, key=category_scores.get)
        best_score = category_scores[best_category]
        
        # Calculate confidence
        total_score = sum(category_scores.values())
        confidence = min(best_score / (total_score + 1), 0.95)
        
        return best_category, max(confidence, 0.5)
    
    def predict_department(self, category: str, district: str = None) -> str:
        """
        Predict department based on category
        
        Args:
            category: Complaint category
            district: District name (for future routing logic)
        
        Returns:
            Department name
        """
        return self.department_mapping.get(category, 'Municipal Corporation')
    
    def get_category_confidence(self, text: str, category: str) -> float:
        """
        Get confidence score for a specific category
        
        Args:
            text: Complaint text
            category: Category to check
        
        Returns:
            Confidence score (0-1)
        """
        if category not in self.category_keywords:
            return 0.0
        
        text_lower = text.lower()
        keywords = self.category_keywords[category]
        
        matches = sum(1 for keyword in keywords if keyword in text_lower)
        return min(matches / len(keywords), 1.0)
