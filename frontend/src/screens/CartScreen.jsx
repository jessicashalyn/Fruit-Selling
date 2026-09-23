import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, Tag, ChevronRight, ShoppingBag } from 'lucide-react';
import { api, AuthContext } from '../context/AuthContext';

export default function CartScreen() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], total_price: 0 });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get('carts/my_cart/');
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (item_id, currentQty, delta) => {
    const newQty = currentQty + delta;
    try {
      if (newQty <= 0) {
        await api.delete('carts/remove_item/', { data: { item_id } });
      } else {
        await api.patch('carts/update_item/', { item_id, quantity: newQty });
      }
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (item_id) => {
    try {
      await api.delete('carts/remove_item/', { data: { item_id } });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = cart.total_price || 0;
  const deliveryFee = subtotal > 300 || subtotal === 0 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div style={{ padding: '24px', height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none' }}>
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>My Cart</h2>
        <div style={{ width: 24 }} />
      </div>

      {(!cart.items || cart.items.length === 0) ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingBag size={64} color="var(--border-color)" />
          <h3 style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Your cart is empty</h3>
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.items.map(item => (
              <div key={item.id} className="glass" style={{ display: 'flex', padding: '16px', borderRadius: '16px', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px', overflow: 'hidden' }}>
                  {item.image_url ? <img src={item.image_url} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : '📦'}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{item.product_name}</h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.unit}</p>
                  <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: 'var(--primary-color)' }}>₹{item.price}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'transparent', border: 'none', color: '#ff7675' }}><Trash2 size={18} /></button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '8px' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity, -1)} style={{background:'none', border:'none'}}><Minus size={16} /></button>
                    <span style={{ fontWeight: 600 }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity, 1)} style={{background:'none', border:'none'}}><Plus size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', padding: '16px', background: 'var(--surface-color)', border: '1px dashed var(--primary-color)', borderRadius: '12px' }}>
            <Tag size={20} color="var(--primary-color)" style={{ marginRight: '12px' }} />
            <input type="text" placeholder="Apply Coupon" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent' }} />
            <button style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600 }}>Apply</button>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-color)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Fee</span>
              <span style={{ fontWeight: 600 }}>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
            </div>
            {deliveryFee > 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--secondary-color)', margin: '0 0 8px 0' }}>Add ₹{300 - subtotal} more for free delivery!</p>
            )}
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary-color)' }}>₹{total}</span>
            </div>
          </div>
        </div>
      )}

      {cart.items && cart.items.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <button onClick={handleCheckout} className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            Proceed to Checkout
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
