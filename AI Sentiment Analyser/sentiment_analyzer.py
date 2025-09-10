#!/usr/bin/env python3
"""
Product Review Sentiment Analyzer
A simplified version that works without external dependencies
"""

import json
import csv
import re
from collections import Counter
import math

class SimpleSentimentAnalyzer:
    def __init__(self):
        # Simple positive and negative word lists
        self.positive_words = {
            'amazing', 'excellent', 'fantastic', 'great', 'wonderful', 'awesome', 
            'perfect', 'love', 'best', 'good', 'nice', 'beautiful', 'outstanding',
            'brilliant', 'superb', 'magnificent', 'incredible', 'marvelous',
            'exceptional', 'impressive', 'delightful', 'pleased', 'satisfied',
            'happy', 'recommend', 'quality', 'fast', 'quick', 'easy', 'comfortable'
        }
        
        self.negative_words = {
            'terrible', 'awful', 'horrible', 'bad', 'worst', 'hate', 'disappointing',
            'useless', 'waste', 'poor', 'cheap', 'broken', 'defective', 'slow',
            'difficult', 'hard', 'uncomfortable', 'annoying', 'frustrating',
            'expensive', 'overpriced', 'fake', 'fraud', 'scam', 'regret',
            'return', 'refund', 'complaint', 'problem', 'issue', 'fail'
        }
    
    def clean_text(self, text):
        """Clean and preprocess text"""
        if not text:
            return ""
        
        # Convert to lowercase and remove special characters
        text = re.sub(r'[^a-zA-Z\s]', '', text.lower())
        # Remove extra whitespace
        text = ' '.join(text.split())
        return text
    
    def calculate_sentiment(self, text):
        """Calculate sentiment score using simple word counting"""
        clean_text = self.clean_text(text)
        words = clean_text.split()
        
        if not words:
            return 0.0, 0.0, 'neutral'
        
        positive_count = sum(1 for word in words if word in self.positive_words)
        negative_count = sum(1 for word in words if word in self.negative_words)
        
        # Calculate polarity (-1 to 1)
        total_sentiment_words = positive_count + negative_count
        if total_sentiment_words == 0:
            polarity = 0.0
        else:
            polarity = (positive_count - negative_count) / len(words)
        
        # Calculate subjectivity (0 to 1)
        subjectivity = total_sentiment_words / len(words) if words else 0.0
        
        # Classify sentiment
        if polarity > 0.1:
            sentiment = 'positive'
        elif polarity < -0.1:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        return polarity, subjectivity, sentiment

def analyze_reviews():
    """Main analysis function"""
    print("🚀 Starting Product Review Sentiment Analysis...")
    
    analyzer = SimpleSentimentAnalyzer()
    results = {
        'total_reviews': 0,
        'sentiment_distribution': {'positive': 0, 'negative': 0, 'neutral': 0},
        'average_polarity': 0.0,
        'average_subjectivity': 0.0,
        'satisfaction_score': 0.0,
        'reviews': [],
        'insights': {},
        'word_analysis': {}
    }
    
    try:
        # Read CSV file
        with open('sample_reviews.csv', 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            reviews_data = list(reader)
        
        print(f"📊 Processing {len(reviews_data)} reviews...")
        
        all_words = []
        polarities = []
        subjectivities = []
        
        for review in reviews_data:
            review_text = review.get('Review_Text', '')
            if not review_text.strip():
                continue
            
            # Analyze sentiment
            polarity, subjectivity, sentiment = analyzer.calculate_sentiment(review_text)
            
            # Store results
            review_result = {
                'review_id': review.get('Review_ID', ''),
                'review_text': review_text,
                'rating': float(review.get('Rating', 0)),
                'sentiment': sentiment,
                'polarity': round(polarity, 3),
                'subjectivity': round(subjectivity, 3),
                'category': review.get('Product_Category', 'Unknown'),
                'verified': review.get('Verified_Purchase', 'No') == 'Yes'
            }
            
            results['reviews'].append(review_result)
            results['sentiment_distribution'][sentiment] += 1
            polarities.append(polarity)
            subjectivities.append(subjectivity)
            
            # Collect words for analysis
            clean_words = analyzer.clean_text(review_text).split()
            all_words.extend([word for word in clean_words if len(word) > 3])
        
        # Calculate statistics
        results['total_reviews'] = len(results['reviews'])
        if results['total_reviews'] > 0:
            results['average_polarity'] = round(sum(polarities) / len(polarities), 3)
            results['average_subjectivity'] = round(sum(subjectivities) / len(subjectivities), 3)
            
            # Calculate satisfaction score (0-100)
            positive_ratio = results['sentiment_distribution']['positive'] / results['total_reviews']
            negative_ratio = results['sentiment_distribution']['negative'] / results['total_reviews']
            results['satisfaction_score'] = round((positive_ratio - negative_ratio + 1) * 50, 1)
        
        # Word frequency analysis
        word_freq = Counter(all_words)
        results['word_analysis'] = {
            'most_common': word_freq.most_common(10),
            'total_unique_words': len(word_freq)
        }
        
        # Generate insights
        results['insights'] = generate_insights(results)
        
        # Save results to JSON
        with open('analysis_results.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print("✅ Analysis completed successfully!")
        print(f"📈 Results: {results['sentiment_distribution']}")
        print(f"🎯 Satisfaction Score: {results['satisfaction_score']}/100")
        
        return results
        
    except FileNotFoundError:
        print("❌ Error: sample_reviews.csv file not found!")
        return None
    except Exception as e:
        print(f"❌ Error during analysis: {str(e)}")
        return None

def generate_insights(results):
    """Generate analytical insights"""
    insights = {}
    
    total = results['total_reviews']
    if total == 0:
        return insights
    
    # Sentiment distribution percentages
    for sentiment in ['positive', 'negative', 'neutral']:
        count = results['sentiment_distribution'][sentiment]
        insights[f'{sentiment}_percentage'] = round((count / total) * 100, 1)
    
    # Overall trend
    if results['satisfaction_score'] >= 70:
        insights['overall_trend'] = 'Highly Positive'
    elif results['satisfaction_score'] >= 50:
        insights['overall_trend'] = 'Moderately Positive'
    elif results['satisfaction_score'] >= 30:
        insights['overall_trend'] = 'Mixed'
    else:
        insights['overall_trend'] = 'Negative'
    
    # Find most positive and negative reviews
    if results['reviews']:
        most_positive = max(results['reviews'], key=lambda x: x['polarity'])
        most_negative = min(results['reviews'], key=lambda x: x['polarity'])
        
        insights['most_positive_review'] = {
            'text': most_positive['review_text'][:100] + '...',
            'polarity': most_positive['polarity']
        }
        insights['most_negative_review'] = {
            'text': most_negative['review_text'][:100] + '...',
            'polarity': most_negative['polarity']
        }
    
    return insights

if __name__ == "__main__":
    analyze_reviews()