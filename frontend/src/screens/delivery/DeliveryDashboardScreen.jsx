import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, MapPin, Navigation, IndianRupee } from 'lucide-react';

export default function DeliveryDashboardScreen() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);

  // Mock active orders available to pick up
  const activeOrders = [
    { id: '#ORD-2024-9981', dist: '2.5 km', pickup: 'Fruit Shop Main', drop: '123 Fresh Lane', amount: 290, cod: false },
    { id: '#ORD-2024-9982', dist: '4.1 km', pickup: 'Fruit Shop Main', drop: '44 Sunset Blvd', amount: 450, cod: true },
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      
      {/* Header section */}
      <div style={{ background: isOnline ? 'var(--secondary-color)' : 'var(--text-muted)', color: 'white', padding: '24px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem' }}>Hi, Ramesh!</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>{isOnline ? 'You are online and visible' : 'You are currently offline'}</p>
          </div>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'var(--shadow-md)' }}
          >
            <Power color={isOnline ? 'var(--secondary-color)' : 'var(--text-muted)'} size={24} />
          </button>
        </div>
        
        {/* Quick Stats */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', opacity: 0.9 }}>Today's Earnings</p>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>₹840</h3>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', opacity: 0.9 }}>Completed</p>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>7 Deliveries</h3>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div style={{ padding: '24px', flex: 1 }}>
        <h3 style={{ marginBottom: '16px' }}>Available Orders</h3>
        
        {!isOnline ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
            <p>Go online to receive order requests.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeOrders.map(order => (
              <div key={order.id} className="glass" style={{ padding: '16px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 600 }}>{order.id}</span>
                  <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{order.dist}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <MapPin size={16} color="var(--secondary-color)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pickup: {order.pickup}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Navigation size={16} color="var(--primary-color)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Drop: {order.drop}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {order.cod ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffeaa7', padding: '4px 8px', borderRadius: '4px' }}>
                      <IndianRupee size={14} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Collect ₹{order.amount} (COD)</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--secondary-color)', fontWeight: 600 }}>Prepaid</span>
                  )}
                  
                  <button onClick={() => navigate(`/delivery/order/${order.id.replace('#', '')}`)} style={{ background: 'var(--text-main)', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '8px', fontWeight: 600 }}>
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
