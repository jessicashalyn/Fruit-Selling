import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, Trash2, Home, Briefcase, Map } from 'lucide-react';
import { api } from '../context/AuthContext';

export default function DeliveryAddressesScreen() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    address_type: 'HOME',
    street_address: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('addresses/');
      setAddresses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('addresses/', formData);
      setShowAddForm(false);
      setFormData({
        address_type: 'HOME',
        street_address: '',
        city: '',
        state: '',
        pincode: '',
        is_default: false
      });
      fetchAddresses();
    } catch (err) {
      console.error(err);
      alert('Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`addresses/${id}/`);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'HOME': return <Home size={20} color="var(--primary-color)" />;
      case 'WORK': return <Briefcase size={20} color="var(--primary-color)" />;
      default: return <Map size={20} color="var(--primary-color)" />;
    }
  };

  return (
    <div style={{ padding: '24px', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: '1.2rem' }}>Delivery Addresses</h2>
        <div style={{ width: 24 }} />
      </div>

      {!showAddForm ? (
        <>
          <button 
            onClick={() => setShowAddForm(true)}
            style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '2px dashed var(--primary-color)', background: 'rgba(34, 160, 95, 0.05)', color: 'var(--primary-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}
          >
            <Plus size={20} />
            Add New Address
          </button>

          {loading ? (
            <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>Loading...</div>
          ) : addresses.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
              <MapPin size={64} color="var(--border-color)" style={{ marginBottom: '16px' }} />
              <h3>No Addresses Found</h3>
              <p>Add a delivery address to proceed.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {addresses.map(addr => (
                <div key={addr.id} className="glass" style={{ padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(34, 160, 95, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {getIconForType(addr.address_type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>{addr.address_type}</h4>
                      {addr.is_default && (
                        <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--primary-light)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Default</span>
                      )}
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                      {addr.street_address}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteAddress(addr.id)} style={{ background: 'transparent', border: 'none', color: '#ff3b30', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleAddAddress} className="glass animate-slide-up" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Enter New Address</h3>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {['HOME', 'WORK', 'OTHER'].map(type => (
              <button 
                key={type}
                type="button"
                onClick={() => setFormData({...formData, address_type: type})}
                style={{ flex: 1, padding: '8px 0', borderRadius: '8px', border: `1px solid ${formData.address_type === type ? 'var(--primary-color)' : 'var(--border-color)'}`, background: formData.address_type === type ? 'var(--primary-light)' : 'transparent', color: formData.address_type === type ? 'white' : 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                {type}
              </button>
            ))}
          </div>

          <input 
            type="text" 
            placeholder="Street Address (e.g., 123 Main St)" 
            value={formData.street_address}
            onChange={(e) => setFormData({...formData, street_address: e.target.value})}
            required
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
          />

          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="City" 
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              required
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
            />
            <input 
              type="text" 
              placeholder="State" 
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              required
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
            />
          </div>

          <input 
            type="text" 
            placeholder="Pincode" 
            value={formData.pincode}
            onChange={(e) => setFormData({...formData, pincode: e.target.value})}
            required
            maxLength={6}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>
            <input 
              type="checkbox" 
              checked={formData.is_default}
              onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
            />
            Set as default address
          </label>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Address</button>
          </div>
        </form>
      )}
    </div>
  );
}
