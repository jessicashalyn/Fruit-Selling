import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Truck } from 'lucide-react';
import { api } from '../../context/AuthContext';

export default function AdminOrdersScreen() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchPartners();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('orders/');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPartners = async () => {
    try {
      // Assuming we have a delivery-partners endpoint
      const res = await api.get('delivery-partners/');
      // Filter approved online partners maybe? For now just take all
      setPartners(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`orders/${orderId}/update_status/`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const assignPartner = async (orderId, partnerId) => {
    try {
      await api.patch(`orders/${orderId}/assign_partner/`, { delivery_partner_id: partnerId });
      fetchOrders();
      alert('Partner assigned successfully');
    } catch (err) {
      console.error(err);
      alert('Error assigning partner');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
      <div style={{ padding: '24px', background: 'var(--surface-color)', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none' }}>
            <ArrowLeft size={24} color="var(--text-main)" />
          </button>
          <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Manage Orders</h2>
          <div style={{ width: 24 }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {orders.length === 0 && <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>No orders available.</p>}
        {orders.map(order => (
          <div key={order.id} className="glass" style={{ padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0' }}>Order #{order.id}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{order.total_amount} • {order.payment_method}</p>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '4px 8px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--text-main)' }}>
                {order.status}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Clock size={16} /> {new Date(order.created_at).toLocaleString()}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Update Status:</label>
              <select 
                value={order.status} 
                onChange={(e) => updateStatus(order.id, e.target.value)}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              >
                <option value="PLACED">Placed</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PACKED">Packed</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Assign Partner:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  defaultValue={order.delivery_partner || ""}
                  onChange={(e) => assignPartner(order.id, e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                >
                  <option value="">Select Partner</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>{p.vehicle_number} ({p.vehicle_type})</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
