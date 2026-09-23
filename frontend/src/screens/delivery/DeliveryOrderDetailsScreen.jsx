import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, PhoneCall, CheckCircle, Truck } from 'lucide-react';

export default function DeliveryOrderDetailsScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState('ACCEPTED'); // ACCEPTED -> PICKED_UP -> DELIVERED

  const handleAction = () => {
    if(status === 'ACCEPTED') setStatus('PICKED_UP');
    else if(status === 'PICKED_UP') setStatus('DELIVERED');
    else navigate('/delivery/dashboard');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none' }}>
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>#{id}</h2>
        <div style={{ width: 24 }} />
      </div>

      {status === 'DELIVERED' ? (
        <div className="animate-slide-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <CheckCircle size={80} color="var(--secondary-color)" style={{ marginBottom: '16px' }} />
          <h2 style={{ marginBottom: '8px' }}>Delivery Completed</h2>
          <p style={{ color: 'var(--text-muted)' }}>Great job! Earnings have been added to your wallet.</p>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Action Card */}
          <div className="glass" style={{ padding: '24px', borderRadius: '16px', background: status === 'ACCEPTED' ? 'var(--primary-light)' : 'var(--accent-color)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-main)' }}>
              {status === 'ACCEPTED' ? 'Navigate to Pickup' : 'Navigate to Drop'}
            </h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button style={{ flex: 1, background: 'var(--surface-color)', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} /> Open Map
              </button>
              <button style={{ flex: 1, background: 'var(--text-main)', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <PhoneCall size={20} /> Call {status === 'ACCEPTED' ? 'Store' : 'Customer'}
              </button>
            </div>
          </div>

          {/* Details */}
          <div>
            <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Order Information</h3>
            <div className="glass" style={{ padding: '16px', borderRadius: '12px' }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>Customer:</strong> Sneha Sharma</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>Items:</strong> 2x Fresh Apples, 1x Bananas</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>Amount:</strong> ₹290 (Prepaid)</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action */}
      <div style={{ marginTop: '24px' }}>
        <button onClick={handleAction} className="btn-primary" style={{ background: status === 'ACCEPTED' ? 'var(--primary-color)' : 'var(--secondary-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          {status === 'ACCEPTED' && <><Truck size={20} /> Mark as Picked Up</>}
          {status === 'PICKED_UP' && <><CheckCircle size={20} /> Verify OTP & Deliver</>}
          {status === 'DELIVERED' && 'Back to Dashboard'}
        </button>
      </div>
    </div>
  );
}
