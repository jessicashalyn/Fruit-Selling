import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PackageCheck, Info, Gift, Trash2 } from 'lucide-react';

export default function NotificationsScreen() {
  const navigate = useNavigate();

  const notifications = [
    { id: 1, type: 'order', title: 'Order Delivered!', message: 'Your order #ORD-9981 has been delivered successfully. Enjoy your fresh fruits!', time: '10m ago', icon: <PackageCheck color="#00b894" /> },
    { id: 2, type: 'promo', title: 'Weekend Sale is ON', message: 'Get 30% off on all exotic fruits this weekend only. Grab them before they are gone.', time: '2h ago', icon: <Gift color="var(--primary-color)" /> },
    { id: 3, type: 'info', title: 'Delivery Delay', message: 'Due to heavy rain, deliveries in your area might be delayed by 15 minutes.', time: '1d ago', icon: <Info color="var(--accent-color)" /> },
  ];

  return (
    <div style={{ padding: '24px', height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none' }}>
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Notifications</h2>
        <button style={{ background: 'transparent', border: 'none' }}>
          <Trash2 size={20} color="var(--text-muted)" />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notifications.map(notif => (
          <div key={notif.id} className="glass" style={{ display: 'flex', padding: '16px', borderRadius: '16px', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
              {notif.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>{notif.title}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notif.time}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
