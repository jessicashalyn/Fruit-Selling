import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Package, CheckCircle, Truck, Star, Phone, Check } from 'lucide-react';
import { api } from '../context/AuthContext';

export default function OrderTrackingScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`orders/${id}/`)
        .then(res => {
          setOrder(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>Loading...</div>;
  if (!order) return <div style={{ padding: '24px', textAlign: 'center' }}>Order not found</div>;

  const STATUS_RANKS = {
    'PLACED': 1,
    'CONFIRMED': 2,
    'PACKED': 3,
    'OUT_FOR_DELIVERY': 4,
    'DELIVERED': 5,
    'CANCELLED': 0,
    'FAILED': 0,
  };

  const currentRank = STATUS_RANKS[order.status] || 0;

  const stages = [
    { 
      label: 'Order Placed', 
      desc: 'We have received your order.',
      time: order.created_at ? new Date(order.created_at).toLocaleString() : 'Done', 
      done: currentRank >= 1 
    },
    { 
      label: 'Order Confirmed', 
      desc: 'Seller has confirmed your order.',
      time: currentRank >= 2 ? 'Done' : 'Pending', 
      done: currentRank >= 2 
    },
    { 
      label: 'Order Packed', 
      desc: 'Your item has been packed and is ready to ship.',
      time: currentRank >= 3 ? 'Done' : 'Pending', 
      done: currentRank >= 3 
    },
    { 
      label: 'Out for Delivery', 
      desc: 'Delivery partner is on the way.',
      time: currentRank >= 4 ? 'Done' : 'Pending', 
      done: currentRank >= 4 
    },
    { 
      label: 'Delivered', 
      desc: 'Order has been delivered.',
      time: currentRank >= 5 ? 'Done' : 'Pending', 
      done: currentRank >= 5 
    },
  ];

  return (
    <div style={{ backgroundColor: '#f5f5f5', height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      
      {/* Header */}
      <div style={{ background: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', padding: 0, marginRight: '16px', display: 'flex' }}>
          <ArrowLeft size={24} color="#333" />
        </button>
        <h2 style={{ flex: 1, margin: 0, fontSize: '1.2rem', color: '#333' }}>Order Details</h2>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Order Info Card */}
        <div style={{ background: '#fff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#777' }}>Order ID</p>
              <h4 style={{ margin: '4px 0 0 0', color: '#333' }}>#{order.id}</h4>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#777' }}>Total Amount</p>
              <h4 style={{ margin: '4px 0 0 0', color: '#333' }}>₹{order.total_amount}</h4>
            </div>
          </div>
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#22a05f' }}>
              {order.status === 'DELIVERED' ? 'Delivered' : `Arriving ${order.expected_delivery ? new Date(order.expected_delivery).toLocaleDateString() : 'Soon'}`}
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
              Payment Method: <strong>{order.payment_method}</strong> ({order.payment_status})
            </p>
          </div>
          {order.address_details && (
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#777', marginBottom: '4px' }}>Delivery Address</p>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={18} color="#22a05f" style={{ marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#333', lineHeight: '1.4' }}>
                  <strong>{order.address_details.address_type}</strong><br/>
                  {order.address_details.street_address}, {order.address_details.city},<br/>
                  {order.address_details.state} - {order.address_details.pincode}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tracking Timeline Card */}
        <div style={{ background: '#fff', borderRadius: '8px', padding: '24px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h4 style={{ margin: '0 0 24px 0', color: '#333', fontSize: '1.1rem' }}>Tracking History</h4>
          <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '8px' }}>
            {stages.map((stage, index) => (
              <div key={index} style={{ display: 'flex', position: 'relative', paddingBottom: index === stages.length - 1 ? '0' : '32px' }}>
                
                {/* Timeline Line */}
                {index < stages.length - 1 && (
                  <div style={{ 
                    position: 'absolute', 
                    left: '11px', 
                    top: '24px', 
                    bottom: '0', 
                    width: '2px', 
                    background: stage.done ? '#22a05f' : '#e0e0e0'
                  }} />
                )}
                
                {/* Timeline Dot */}
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: stage.done ? '#22a05f' : '#fff',
                  border: stage.done ? 'none' : '2px solid #ccc',
                  color: '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1,
                  marginTop: '2px',
                  marginRight: '16px',
                  boxShadow: stage.done ? '0 0 0 4px rgba(34, 160, 95, 0.2)' : 'none'
                }}>
                  {stage.done && <Check size={14} strokeWidth={3} />}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: stage.done ? '#333' : '#999', fontWeight: stage.done ? '600' : '400' }}>
                    {stage.label}
                  </h5>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#777' }}>
                    {stage.desc}
                  </p>
                  {stage.done && (
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#999' }}>{stage.time}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Partner Card */}
        {order.delivery_partner_id && (
          <div style={{ background: '#fff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '1rem' }}>Delivery Agent</h4>
              <p style={{ margin: 0, color: '#777', fontSize: '0.85rem' }}>ID: {order.delivery_partner_id}</p>
            </div>
            <button style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#333', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <Phone size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
