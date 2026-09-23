import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, User, Plus } from 'lucide-react';
import { api } from '../../context/AuthContext';

export default function AdminPartnersScreen() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Bike');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await api.get('delivery-partners/');
      setPartners(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproval = async (id, status) => {
    try {
      await api.patch(`delivery-partners/${id}/`, { is_approved: status });
      fetchPartners();
    } catch (err) {
      console.error(err);
      alert('Error updating approval status');
    }
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    try {
      await api.post('delivery-partners/add_partner/', {
        mobile_number: mobileNumber,
        vehicle_number: vehicleNumber,
        vehicle_type: vehicleType
      });
      setShowAddModal(false);
      setMobileNumber('');
      setVehicleNumber('');
      setVehicleType('Bike');
      fetchPartners();
    } catch (err) {
      console.error(err);
      alert('Error adding delivery partner');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
      <div style={{ padding: '24px', background: 'var(--surface-color)', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none' }}>
            <ArrowLeft size={24} color="var(--text-main)" />
          </button>
          <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Delivery Partners</h2>
          <button onClick={() => setShowAddModal(true)} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {partners.length === 0 && <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>No delivery partners registered yet.</p>}
        {partners.map(partner => (
          <div key={partner.id} className="glass" style={{ padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'var(--primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <User color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 4px 0' }}>{partner.vehicle_number}</h4>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{partner.vehicle_type}</p>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: partner.is_approved ? 'rgba(0,184,148,0.2)' : 'rgba(255,118,117,0.2)', color: partner.is_approved ? '#00b894' : '#ff7675' }}>
                {partner.is_approved ? 'Approved' : 'Pending'}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {!partner.is_approved ? (
                <button onClick={() => handleApproval(partner.id, true)} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>Approve</button>
              ) : (
                <button onClick={() => handleApproval(partner.id, false)} style={{ background: 'var(--border-color)', color: 'var(--text-main)', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>Revoke</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass" style={{ width: '90%', maxWidth: '400px', padding: '24px', borderRadius: '24px', background: 'var(--surface-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Add Partner</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none' }}>
                <X size={24} color="var(--text-main)" />
              </button>
            </div>
            
            <form onSubmit={handleAddPartner} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Mobile Number</label>
                <input 
                  type="text" 
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. 9876543210"
                  style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px', fontSize: '1rem', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Vehicle Number</label>
                <input 
                  type="text" 
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. TN-01-AB-1234"
                  style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px', fontSize: '1rem', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px', fontSize: '1rem', outline: 'none', background: 'white' }}
                >
                  <option value="Bike">Bike</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Electric Bike">Electric Bike</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>
                Add Partner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
