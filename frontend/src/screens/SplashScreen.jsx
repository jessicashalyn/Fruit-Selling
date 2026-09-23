import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to onboarding after 2.5 seconds
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'var(--gradient-primary)',
      color: 'white'
    }}>
      <div style={{
        animation: 'pulse 2s infinite',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '24px',
          borderRadius: '50%',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-glass)'
        }}>
          <Leaf size={64} color="white" />
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Fruit Shop</h1>
        <p style={{ fontSize: '1rem', opacity: 0.9, textAlign: 'center', maxWidth: '80%' }}>
          Fresh Fruits • Healthy Living • Right to Your Doorstep
        </p>
      </div>
    </div>
  );
}
