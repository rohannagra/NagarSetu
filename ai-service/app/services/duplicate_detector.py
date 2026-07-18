from typing import List, Dict, Any
import re

class DuplicateDetector:
    """
    Detect duplicate or similar complaints
    Uses text similarity and location proximity
    """
    
    def __init__(self):
        self.similarity_threshold = 0.7
        self.location_radius_km = 2  # 2 km radius
    
    def find_similar(
        self,
        text: str,
        location: Dict[str, Any],
        existing_complaints: List[Dict]
    ) -> List[Dict[str, Any]]:
        """
        Find similar complaints based on text and location
        
        Args:
            text: Complaint text
            location: Location dict with coordinates
            existing_complaints: List of existing complaint dicts
        
        Returns:
            List of similar complaints with similarity scores
        """
        similar_complaints = []
        
        text_lower = text.lower()
        text_words = set(self._tokenize(text_lower))
        
        for complaint in existing_complaints:
            # Calculate text similarity
            complaint_text = f"{complaint.get('title', '')} {complaint.get('description', '')}"
            similarity = self._calculate_text_similarity(text_lower, complaint_text.lower())
            
            # Calculate location proximity if coordinates available
            location_score = 1.0
            if location.get('coordinates') and complaint.get('location', {}).get('coordinates'):
                distance = self._calculate_distance(
                    location['coordinates'],
                    complaint['location']['coordinates']
                )
                # Closer = higher score
                location_score = max(1 - (distance / self.location_radius_km), 0)
            
            # Combined score
            combined_score = (similarity * 0.7) + (location_score * 0.3)
            
            if combined_score >= 0.5:  # Threshold for "similar"
                similar_complaints.append({
                    'complaint_id': complaint.get('complaintId', complaint.get('_id')),
                    'title': complaint.get('title', ''),
                    'similarity': round(combined_score, 2),
                    'text_similarity': round(similarity, 2),
                    'location_proximity': round(location_score, 2),
                    'status': complaint.get('status', 'unknown')
                })
        
        # Sort by similarity (descending)
        similar_complaints.sort(key=lambda x: x['similarity'], reverse=True)
        
        return similar_complaints[:10]  # Return top 10
    
    def _calculate_text_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate Jaccard similarity between two texts
        
        Args:
            text1: First text
            text2: Second text
        
        Returns:
            Similarity score (0-1)
        """
        words1 = set(self._tokenize(text1))
        words2 = set(self._tokenize(text2))
        
        if not words1 or not words2:
            return 0.0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union)
    
    def _tokenize(self, text: str) -> List[str]:
        """
        Tokenize text into words
        
        Args:
            text: Text to tokenize
        
        Returns:
            List of words
        """
        # Remove punctuation and split
        text = re.sub(r'[^\w\s]', ' ', text)
        words = text.split()
        
        # Remove stop words (simplified)
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
            'can', 'could', 'may', 'might', 'must', 'i', 'you', 'he', 'she', 'it',
            'we', 'they', 'this', 'that', 'these', 'those'
        }
        
        return [w for w in words if w not in stop_words and len(w) > 2]
    
    def _calculate_distance(self, coords1: List[float], coords2: List[float]) -> float:
        """
        Calculate distance between two coordinates using Haversine formula
        
        Args:
            coords1: [longitude, latitude]
            coords2: [longitude, latitude]
        
        Returns:
            Distance in kilometers
        """
        from math import radians, sin, cos, sqrt, atan2
        
        lon1, lat1 = coords1
        lon2, lat2 = coords2
        
        # Earth's radius in km
        R = 6371.0
        
        # Convert to radians
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        
        distance = R * c
        return distance
