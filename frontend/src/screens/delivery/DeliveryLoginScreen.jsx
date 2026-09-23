import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, Phone } from 'lucide-react';
import { api, AuthContext } from '../../context/AuthContext';

export default function DeliveryLoginScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (mobileNumber.length >= 10) {
      try {
        await api.post('auth/send-otp/', { mobile_number: mobileNumber });
        setOtpSent(true);
      } catch (err) {
        console.error(err);
        alert('Failed to send OTP');
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('auth/verify-otp/', { mobile_number: mobileNumber, otp });
      const { access, role } = res.data;
      
      if (role !== 'DELIVERY_PARTNER') {
        alert('Unauthorized! Partner access required.');
        return;
      }
      login(access, role);
      navigate('/delivery/dashboard');
    } catch (err) {
      console.error(err);
      alert('Invalid OTP');
    }
  };

  return (
    <div className="animate-slide-up" style={{ padding: '32px 24px', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--text-main)', color: 'white' }}>
      <div style={{ marginTop: '80px', marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
          <Bike size={40} color="var(--primary-color)" />
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', textAlign: 'center' }}>Partner Login</h1>
        <p style={{ opacity: 0.7, textAlign: 'center' }}>Deliver freshness daily.</p>
      </div>

      <div style={{ flex: 1 }}>
        {!otpSent ? (
          <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Registered Mobile</label>
              <input 
                type="tel" 
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter mobile number"
                style={{ width: '100%', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '16px', fontSize: '1rem', color: 'white', background: 'rgba(255,255,255,0.05)', outline: 'none' }}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ background: 'var(--primary-color)', color: 'white' }}>
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Enter OTP</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="• • • • • •"
                maxLength={6}
                style={{ width: '100%', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '16px', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '8px', background: 'rgba(255,255,255,0.05)', outline: 'none', color: 'white' }}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ background: 'var(--primary-color)', color: 'white' }}>
              Verify & Start Earnings
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
