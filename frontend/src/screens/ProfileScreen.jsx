import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Package, LogOut, ChevronRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ padding: '24px', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', overflowY: 'auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>My Profile</h2>
        <div style={{ width: 24 }} />
      </div>

      {/* Profile Card */}
      <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <User size={32} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>Customer</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Account Active</p>
        </div>
      </div>

      {/* Menu Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div className="glass" style={{ borderRadius: '16px', padding: '8px 16px' }}>
          
          <button onClick={() => navigate('/my-orders')} style={{ width: '100%', padding: '16px 0', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(34, 160, 95, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-color)', marginRight: '16px' }}>
              <Package size={20} />
            </div>
            <span style={{ flex: 1, textAlign: 'left', fontSize: '1rem', fontWeight: 500, color: 'var(--text-main)' }}>My Orders</span>
            <ChevronRight size={20} color="var(--text-muted)" />
          </button>

          <button onClick={() => navigate('/addresses')} style={{ width: '100%', padding: '16px 0', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(34, 160, 95, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-color)', marginRight: '16px' }}>
              <MapPin size={20} />
            </div>
            <span style={{ flex: 1, textAlign: 'left', fontSize: '1rem', fontWeight: 500, color: 'var(--text-main)' }}>Delivery Addresses</span>
            <ChevronRight size={20} color="var(--text-muted)" />
          </button>

          <button onClick={handleLogout} style={{ width: '100%', padding: '16px 0', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255, 59, 48, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ff3b30', marginRight: '16px' }}>
              <LogOut size={20} />
            </div>
            <span style={{ flex: 1, textAlign: 'left', fontSize: '1rem', fontWeight: 500, color: '#ff3b30' }}>Logout</span>
            <ChevronRight size={20} color="var(--text-muted)" />
          </button>

        </div>

      </div>
    </div>
  );
}
