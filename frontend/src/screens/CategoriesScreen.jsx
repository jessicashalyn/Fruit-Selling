import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../context/AuthContext';

export default function CategoriesScreen() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('categories/');
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Map backend categories to colors/emojis for UI flair since image uploads aren't seeded yet
  const getUiData = (name) => {
    const map = {
      'Fresh Fruits': { img: '🍎', color: '#ff7675' },
      'Exotic Fruits': { img: '🥝', color: '#55efc4' },
      'Seasonal Fruits': { img: '🥭', color: '#fdcb6e' },
      'Combos': { img: '🧺', color: '#a29bfe' },
    };
    return map[name] || { img: '🍉', color: '#ff9ff3' };
  };

  return (
    <div style={{ padding: '24px', height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none' }}>
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Categories</h2>
        <div style={{ width: 24 }} />
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="animate-pulse">Loading Categories...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {categories.map((cat) => {
            const ui = getUiData(cat.name);
            return (
              <div 
                key={cat.id} 
                onClick={() => navigate(`/category/${cat.id}`)}
                className="glass" 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', borderRadius: '24px', borderTop: `4px solid ${ui.color}`, cursor: 'pointer' }}
              >
                <div style={{ width: '80px', height: '80px', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4rem' }}>
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    ui.img
                  )}
                </div>
                <h3 style={{ margin: 0, fontSize: '1rem', textAlign: 'center' }}>{cat.name}</h3>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
