import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { api } from '../context/AuthContext';

export default function MyOrdersScreen() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('orders/');
      // Sort orders by most recent first
      const sortedOrders = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(sortedOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'DELIVERED': return '#22a05f';
      case 'CANCELLED': 
      case 'FAILED': return '#ff3b30';
      default: return '#f5a623';
    }
  };

  return (
    <div style={{ padding: '24px', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: '1.2rem' }}>My Orders</h2>
        <div style={{ width: 24 }} />
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Loading...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
          <Package size={64} color="var(--border-color)" style={{ marginBottom: '16px' }} />
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders.</p>
          <button onClick={() => navigate('/home')} className="btn-primary" style={{ marginTop: '16px' }}>Shop Now</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div 
              key={order.id} 
              className="glass" 
              style={{ padding: '16px', borderRadius: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}
              onClick={() => navigate(`/tracking/${order.id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order #{order.id}</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status), fontSize: '0.8rem', fontWeight: 600 }}>
                  {order.status}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem' }}>{order.items?.length || 0} items</span>
                <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>₹{order.total_amount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
