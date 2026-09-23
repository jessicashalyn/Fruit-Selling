import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { api, AuthContext } from '../../context/AuthContext';

export default function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('auth/admin-login/', { email, password });
      const { access, role } = res.data;
      
      if (role !== 'ADMIN') {
        alert('Unauthorized! Admin access required.');
        return;
      }
      login(access, role);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert('Invalid Email or Password');
    }
  };

  return (
    <div className="animate-slide-up" style={{ padding: '32px 24px', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--text-main)', color: 'white' }}>
      <div style={{ marginTop: '80px', marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
          <Shield size={40} color="var(--primary-color)" />
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', textAlign: 'center' }}>Admin Portal</h1>
        <p style={{ opacity: 0.7, textAlign: 'center' }}>Authorized personnel only.</p>
      </div>

      <div style={{ flex: 1 }}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Admin Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              style={{ width: '100%', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '16px', fontSize: '1rem', color: 'white', background: 'rgba(255,255,255,0.05)', outline: 'none' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '16px', fontSize: '1rem', color: 'white', background: 'rgba(255,255,255,0.05)', outline: 'none' }}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ background: 'var(--primary-color)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            Login <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
