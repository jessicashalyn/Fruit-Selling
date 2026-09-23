import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';
import { api, AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOTP = async (e) => {
    e?.preventDefault();
    if (mobileNumber.length >= 10) {
      try {
        const res = await api.post('auth/send-otp/', { phone: mobileNumber });
        setOtpSent(true);
        setCountdown(30);
        if (res.data.mock_otp) {
          alert(`[Test Mode] Your OTP is: ${res.data.mock_otp}`);
          setOtp(res.data.mock_otp);
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || 'Failed to send OTP');
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('auth/verify-otp/', { phone: mobileNumber, otp });
      const { access, role } = res.data;
      login(access, role);
      
      if (role === 'ADMIN') {
          navigate('/admin/dashboard');
      } else if (role === 'DELIVERY_PARTNER') {
          navigate('/delivery/dashboard');
      } else {
          navigate('/home'); 
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Invalid OTP');
    }
  };

  const handleGuest = () => {
    navigate('/home');
  };

  return (
    <div className="animate-slide-up" style={{ padding: '32px 24px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginTop: '40px', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Welcome Back!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Sign in to continue your fresh journey.</p>
      </div>

      <div style={{ flex: 1 }}>
        {!otpSent ? (
          <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>Mobile Number</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0 16px', background: 'var(--surface-color)' }}>
                <Phone size={20} color="var(--text-muted)" style={{ marginRight: '12px' }} />
                <span style={{ color: 'var(--text-main)', marginRight: '8px', fontWeight: 500 }}>+91</span>
                <input 
                  type="tel" 
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter your number"
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '16px 0', fontSize: '1rem', color: 'var(--text-main)', background: 'transparent' }}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>Enter OTP</label>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Sent to +91 {mobileNumber}</p>
              
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="• • • • • •"
                maxLength={6}
                style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '8px', background: 'var(--surface-color)', outline: 'none' }}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
              Verify & Login
            </button>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button 
                type="button" 
                onClick={handleSendOTP} 
                disabled={countdown > 0}
                style={{ background: 'none', border: 'none', color: countdown > 0 ? 'gray' : 'var(--primary-color)', cursor: countdown > 0 ? 'default' : 'pointer', fontWeight: 600 }}
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'var(--text-muted)' }}>or</span>
          <button type="button" onClick={handleGuest} className="btn-outline">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
