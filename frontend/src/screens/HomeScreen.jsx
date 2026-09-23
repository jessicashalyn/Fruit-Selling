import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Bell, ShoppingBag, Home, Grid, User, Plus } from 'lucide-react';
import { api, AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadData('');
  }, []);

  const loadData = async (query) => {
    try {
      const catRes = await api.get('categories/');
      setCategories(catRes.data);

      const endpoint = query ? `products/?search=${query}` : 'products/';
      const allProdRes = await api.get(endpoint);
      setFeaturedProducts(allProdRes.data);
      
      if (token) {
        const cartRes = await api.get('carts/my_cart/');
        const count = cartRes.data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        setCartCount(count);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    loadData(val);
  };

  const handleAddToCart = async (product_id) => {
    if (!token) {
        navigate('/login');
        return;
    }
    try {
        const res = await api.post('carts/add_item/', { product_id, quantity: 1 });
        const count = res.data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        setCartCount(count);
    } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.error) {
            alert(err.response.data.error);
        } else {
            alert('Error adding to cart');
        }
    }
  };

  const getUiData = (name) => {
    const map = {
      'Fresh Fruits': '🍎',
      'Exotic Fruits': '🥝',
      'Seasonal Fruits': '🥭',
      'Combos': '🧺',
      'Kashmir Apples': '🍎',
      'Organic Bananas': '🍌',
      'Dragon Fruit': '🐉'
    };
    return map[name] || '🍉';
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
      
      {/* Header */}
      <div style={{ padding: '24px 24px 16px', background: 'var(--surface-color)', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <MapPin size={20} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Delivering to</p>
              <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>Home - 110016</h4>
            </div>
          </div>
          <button onClick={() => navigate('/notifications')} style={{ background: 'transparent', border: 'none', position: 'relative', cursor: 'pointer' }}>
            <Bell size={24} color="var(--text-main)" />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, background: 'var(--primary-color)', borderRadius: '50%', border: '2px solid white' }} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', padding: '12px 16px', borderRadius: '16px', gap: '12px' }}>
          <Search size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search fresh fruits..."
            style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: '1rem' }}
          />
        </div>
      </div>

      {/* Main Scrollable Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        
        {/* Promotional Banner */}
        <div style={{ background: 'var(--gradient-fresh)', padding: '24px', borderRadius: '24px', color: 'white', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', position: 'relative', zIndex: 1 }}>Get 20% Off</h2>
          <p style={{ margin: '0 0 16px 0', opacity: 0.9, position: 'relative', zIndex: 1 }}>On your first fresh fruit order!</p>
          <button style={{ background: 'white', color: 'var(--secondary-color)', border: 'none', padding: '8px 16px', borderRadius: '24px', fontWeight: 600, position: 'relative', zIndex: 1 }}>
            Order Now
          </button>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '100px', opacity: 0.2 }}>
            🥭
          </div>
        </div>

        {/* Categories Preview */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Categories</h3>
          <button onClick={() => navigate('/categories')} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontWeight: 600 }}>See All</button>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ minWidth: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '24px', background: 'var(--surface-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                {cat.image ? <img src={cat.image} style={{width:'100%', height:'100%', borderRadius:'24px', objectFit:'cover'}} /> : getUiData(cat.name)}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, textAlign: 'center' }}>{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Sections or Search Results */}
        {searchQuery ? (
          <div>
            <h3 style={{ margin: '24px 0 16px 0', fontSize: '1.2rem' }}>Search Results</h3>
            {featuredProducts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No products found for "{searchQuery}"</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {featuredProducts.map(product => (
                  <div key={product.id} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '16px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px', overflow: 'hidden' }}>
                      {product.image ? <img src={product.image} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : '📦'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{product.name}</h4>
                      <p style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{product.unit}</p>
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>₹{product.price}</span>
                    </div>
                    <button onClick={() => handleAddToCart(product.id)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-color)', color: 'white', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
                      <Plus size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          [
            { title: 'Best Sellers', field: 'is_bestseller' },
            { title: 'Featured', field: 'is_featured' },
            { title: 'Seasonal', field: 'is_seasonal' },
            { title: 'Recommended', field: 'is_recommended' },
          ].map(section => {
            const sectionProducts = featuredProducts.filter(p => p[section.field]);
            if (sectionProducts.length === 0) return null;

            return (
              <div key={section.title}>
                <h3 style={{ margin: '24px 0 16px 0', fontSize: '1.2rem' }}>{section.title}</h3>
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '24px', scrollbarWidth: 'none' }}>
                  {sectionProducts.map(product => (
                    <div key={product.id} className="glass" style={{ minWidth: '160px', padding: '16px', borderRadius: '24px', position: 'relative' }}>
                      <div style={{ height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '12px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.02)' }}>
                        {product.image ? <img src={product.image} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <div style={{fontSize: '4rem'}}>{getUiData(product.name)}</div>}
                      </div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{product.name}</h4>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{product.unit}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>₹{product.price}</span>
                        <button onClick={() => handleAddToCart(product.id)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-color)', color: 'white', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{ background: 'var(--surface-color)', display: 'flex', justifyContent: 'space-around', padding: '16px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)' }}>
        <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Home size={24} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Home</span>
        </button>
        <button onClick={() => navigate('/categories')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Grid size={24} />
          <span style={{ fontSize: '0.75rem' }}>Categories</span>
        </button>
        <button onClick={() => navigate('/cart')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative' }}>
          <ShoppingBag size={24} />
          {cartCount > 0 && (
            <div style={{ position: 'absolute', top: -5, right: 10, background: 'var(--primary-color)', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: '0.7rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
              {cartCount}
            </div>
          )}
          <span style={{ fontSize: '0.75rem' }}>Cart</span>
        </button>
        <button onClick={() => navigate('/profile')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <User size={24} />
          <span style={{ fontSize: '0.75rem' }}>Profile</span>
        </button>
      </div>

    </div>
  );
}
