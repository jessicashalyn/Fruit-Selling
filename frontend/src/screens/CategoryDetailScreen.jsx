import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Plus } from 'lucide-react';
import { api, AuthContext } from '../context/AuthContext';

export default function CategoryDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        const [catRes, prodRes, cartRes] = await Promise.all([
          api.get(`categories/${id}/`),
          api.get(`products/?category=${id}`),
          api.get('carts/my_cart/')
        ]);
        setCategory(catRes.data);
        // Filter out inactive products locally just in case backend didn't filter them
        setProducts(prodRes.data.filter(p => p.is_active));
        
        const count = cartRes.data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        setCartCount(count);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryAndProducts();
  }, [id]);

  const handleAddToCart = async (product_id) => {
    if (!token) {
        navigate('/login');
        return;
    }
    try {
        const res = await api.post('carts/add_item/', { product_id, quantity: 1 });
        const count = res.data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        setCartCount(count);
        // We could show a toast here
    } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.error) {
            alert(err.response.data.error); // E.g., "Out of Stock" or "Only 3 items are available"
        } else {
            alert('Error adding to cart');
        }
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
      {/* Header */}
      <div style={{ padding: '24px 24px 16px', background: 'var(--surface-color)', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none' }}>
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: '1.2rem' }}>
          {category ? category.name : 'Loading...'}
        </h2>
        <button onClick={() => navigate('/cart')} style={{ background: 'transparent', border: 'none', position: 'relative', cursor: 'pointer' }}>
          <ShoppingBag size={24} color="var(--text-main)" />
          {cartCount > 0 && (
            <div style={{ position: 'absolute', top: -5, right: -5, background: 'var(--primary-color)', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: '0.7rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
              {cartCount}
            </div>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
            No products found in this category.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {products.map(product => (
              <div key={product.id} className="glass" style={{ display: 'flex', padding: '16px', borderRadius: '16px', position: 'relative', opacity: product.stock > 0 ? 1 : 0.5 }}>
                
                {/* Product Image */}
                <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px', overflow: 'hidden' }}>
                  {product.image ? <img src={product.image} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : '📦'}
                </div>
                
                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{product.name}</h4>
                    <p style={{ margin: '0 0 4px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{product.unit} {product.stock === 0 ? '• Out of Stock' : ''}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '1.1rem' }}>₹{product.price}</span>
                    {product.discount_price && (
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.9rem' }}>₹{product.original_price}</span>
                    )}
                  </div>
                </div>

                {/* Add to Cart */}
                <button 
                  onClick={() => handleAddToCart(product.id)} 
                  disabled={product.stock === 0}
                  style={{ 
                    position: 'absolute', right: '16px', bottom: '16px',
                    width: 36, height: 36, borderRadius: '50%', 
                    background: product.stock > 0 ? 'var(--primary-color)' : 'gray', 
                    color: 'white', border: 'none', 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', 
                    boxShadow: 'var(--shadow-sm)', cursor: product.stock > 0 ? 'pointer' : 'not-allowed' 
                  }}
                >
                  <Plus size={20} />
                </button>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
