from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import logging
from datetime import datetime

from app.services.classifier import ComplaintClassifier
from app.services.sentiment_analyzer import SentimentAnalyzer
from app.services.urgency_detector import UrgencyDetector
from app.services.duplicate_detector import DuplicateDetector
from app.utils.text_processor import TextProcessor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Nagar Setu AI Service",
    description="AI-powered complaint analysis and classification service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI services
try:
    classifier = ComplaintClassifier()
    sentiment_analyzer = SentimentAnalyzer()
    urgency_detector = UrgencyDetector()
    duplicate_detector = DuplicateDetector()
    text_processor = TextProcessor()
    logger.info("✅ AI services initialized successfully")
except Exception as e:
    logger.error(f"❌ Error initializing AI services: {e}")

# Request models
class Location(BaseModel):
    coordinates: List[float] = Field(..., min_items=2, max_items=2)
    address: str
    district: str
    state: str

class ComplaintAnalysisRequest(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    location: Location

class DuplicateCheckRequest(BaseModel):
    title: str
    description: str
    location: Location
    existing_complaints: List[dict] = []

# Response models
class ComplaintAnalysisResponse(BaseModel):
    category: str
    department: str
    sentiment: str
    urgency_score: float
    priority: str
    summary: str
    keywords: List[str]
    confidence: float
    abusive_detected: bool
    duplicate_score: float
    similar_complaints: List[dict]
    language: str
    processed_at: str

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Nagar Setu AI Service",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Nagar Setu AI Service",
        "version": "1.0.0",
        "endpoints": {
            "classify": "POST /classify - Analyze and classify complaint",
            "sentiment": "POST /sentiment - Analyze sentiment",
            "urgency": "POST /urgency - Detect urgency level",
            "duplicate": "POST /duplicate - Check for duplicates",
            "summarize": "POST /summarize - Generate summary",
            "keywords": "POST /keywords - Extract keywords"
        }
    }

# Main classification endpoint
@app.post("/classify", response_model=ComplaintAnalysisResponse)
async def classify_complaint(request: ComplaintAnalysisRequest):
    """
    Comprehensive complaint analysis including:
    - Category classification
    - Department routing
    - Sentiment analysis
    - Urgency detection
    - Summary generation
    - Keyword extraction
    - Duplicate detection
    - Abusive language detection
    """
    try:
        logger.info(f"Processing complaint: {request.title[:50]}...")
        
        # Combine title and description for analysis
        full_text = f"{request.title}. {request.description}"
        
        # Detect language
        language = text_processor.detect_language(full_text)
        
        # Clean and preprocess text
        cleaned_text = text_processor.clean_text(full_text)
        
        # 1. Classify category
        predicted_category, category_confidence = classifier.predict_category(
            cleaned_text, 
            request.category
        )
        
        # 2. Determine department
        department = classifier.predict_department(predicted_category, request.location.district)
        
        # 3. Sentiment analysis
        sentiment, sentiment_score = sentiment_analyzer.analyze(cleaned_text)
        
        # 4. Urgency detection
        urgency_score = urgency_detector.calculate_urgency(
            cleaned_text,
            predicted_category,
            sentiment,
            request.location
        )
        
        # Determine priority based on urgency
        if urgency_score >= 80:
            priority = "critical"
        elif urgency_score >= 60:
            priority = "high"
        elif urgency_score >= 40:
            priority = "medium"
        else:
            priority = "low"
        
        # 5. Generate summary
        summary = text_processor.generate_summary(cleaned_text)
        
        # 6. Extract keywords
        keywords = text_processor.extract_keywords(cleaned_text)
        
        # 7. Detect abusive language
        abusive_detected = text_processor.detect_abusive_language(cleaned_text)
        
        # 8. Check for duplicates (simplified for now)
        duplicate_score = 0.0
        similar_complaints = []
        
        response = ComplaintAnalysisResponse(
            category=predicted_category,
            department=department,
            sentiment=sentiment,
            urgency_score=round(urgency_score, 2),
            priority=priority,
            summary=summary,
            keywords=keywords[:10],  # Top 10 keywords
            confidence=round(category_confidence, 2),
            abusive_detected=abusive_detected,
            duplicate_score=duplicate_score,
            similar_complaints=similar_complaints,
            language=language,
            processed_at=datetime.now().isoformat()
        )
        
        logger.info(f"✅ Classification complete: {predicted_category} - {priority}")
        return response
        
    except Exception as e:
        logger.error(f"❌ Classification error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")

# Sentiment analysis endpoint
@app.post("/sentiment")
async def analyze_sentiment(text: str):
    """Analyze sentiment of text"""
    try:
        sentiment, score = sentiment_analyzer.analyze(text)
        return {
            "sentiment": sentiment,
            "score": round(score, 2),
            "confidence": abs(score)
        }
    except Exception as e:
        logger.error(f"Sentiment analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Urgency detection endpoint
@app.post("/urgency")
async def detect_urgency(request: ComplaintAnalysisRequest):
    """Detect urgency level of complaint"""
    try:
        full_text = f"{request.title}. {request.description}"
        cleaned_text = text_processor.clean_text(full_text)
        
        urgency_score = urgency_detector.calculate_urgency(
            cleaned_text,
            request.category or "other",
            "neutral",
            request.location
        )
        
        return {
            "urgency_score": round(urgency_score, 2),
            "level": "critical" if urgency_score >= 80 else "high" if urgency_score >= 60 else "medium" if urgency_score >= 40 else "low"
        }
    except Exception as e:
        logger.error(f"Urgency detection error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Summarization endpoint
@app.post("/summarize")
async def summarize_text(text: str, max_length: int = 100):
    """Generate summary of text"""
    try:
        summary = text_processor.generate_summary(text, max_length)
        return {
            "summary": summary,
            "original_length": len(text),
            "summary_length": len(summary)
        }
    except Exception as e:
        logger.error(f"Summarization error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Keyword extraction endpoint
@app.post("/keywords")
async def extract_keywords(text: str, top_n: int = 10):
    """Extract keywords from text"""
    try:
        keywords = text_processor.extract_keywords(text, top_n)
        return {
            "keywords": keywords,
            "count": len(keywords)
        }
    except Exception as e:
        logger.error(f"Keyword extraction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Duplicate detection endpoint
@app.post("/duplicate")
async def check_duplicate(request: DuplicateCheckRequest):
    """Check if complaint is duplicate"""
    try:
        full_text = f"{request.title}. {request.description}"
        
        # Find similar complaints
        similar = duplicate_detector.find_similar(
            full_text,
            request.location,
            request.existing_complaints
        )
        
        # Calculate overall duplicate score
        duplicate_score = max([s['similarity'] for s in similar], default=0.0)
        
        return {
            "is_duplicate": duplicate_score > 0.85,
            "duplicate_score": round(duplicate_score, 2),
            "similar_complaints": similar[:5],  # Top 5 similar
            "threshold": 0.85
        }
    except Exception as e:
        logger.error(f"Duplicate detection error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
