import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Heart } from 'lucide-react';

const slides = [
  {
    title: 'Fresh Fruits & Quality Products',
    description: 'We source the best and freshest fruits directly from organic farms.',
    icon: <Heart size={100} color="var(--primary-color)" />
  },
  {
    title: 'Easy Ordering & Fast Delivery',
    description: 'A simple shopping experience delivered straight to your doorstep.',
    icon: <ShoppingBag size={100} color="var(--secondary-color)" />
  },
  {
    title: 'Healthy Lifestyle, Guaranteed',
    description: 'Eat fresh, stay healthy, and enjoy our premium fruits every day.',
    icon: <Truck size={100} color="var(--accent-color)" />
  }
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  return (
    <div className="animate-slide-up" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      
      {/* Header (Skip) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
        <button onClick={handleSkip} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ marginBottom: '40px', animation: 'slideUpFade 0.5s' }}>
          {slides[currentSlide].icon}
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text-main)' }}>
          {slides[currentSlide].title}
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '90%' }}>
          {slides[currentSlide].description}
        </p>
      </div>

      {/* Footer Controls */}
      <div style={{ paddingBottom: '32px' }}>
        {/* Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          {slides.map((_, index) => (
            <div key={index} style={{
              width: currentSlide === index ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: currentSlide === index ? 'var(--primary-color)' : 'var(--border-color)',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>

        <button className="btn-primary" onClick={handleNext} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
