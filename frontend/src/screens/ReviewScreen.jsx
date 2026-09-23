import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ThumbsUp } from 'lucide-react';

export default function ReviewScreen() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your feedback!");
    navigate('/home');
  };

  return (
    <div style={{ padding: '24px', height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none' }}>
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Rate Order</h2>
        <div style={{ width: 24 }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Visual Header */}
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
          <ThumbsUp size={40} color="white" />
        </div>
        <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>How was your fruit box?</h3>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px' }}>Order #ORD-2024-9981 delivered today</p>

        {/* Star Rating */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star} 
              onClick={() => setRating(star)}
              style={{ background: 'transparent', border: 'none' }}
            >
              <Star 
                size={40} 
                color={star <= rating ? "var(--accent-color)" : "var(--border-color)"} 
                fill={star <= rating ? "var(--accent-color)" : "transparent"} 
                style={{ transition: 'all 0.2s' }}
              />
            </button>
          ))}
        </div>

        {/* Review Input */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600 }}>Leave a comment (Optional)</label>
            <textarea 
              rows="4" 
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us what you liked..."
              style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface-color)', fontFamily: 'inherit', resize: 'none' }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={rating === 0} style={{ opacity: rating === 0 ? 0.5 : 1 }}>
            Submit Feedback
          </button>
        </form>

      </div>
    </div>
  );
}
