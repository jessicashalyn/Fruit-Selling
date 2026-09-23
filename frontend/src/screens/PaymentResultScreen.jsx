import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { api, AuthContext } from '../context/AuthContext';

export default function PaymentResultScreen() {
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

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!order) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Order not found</div>;
  }

  // Treat COD differently or just show success for all created orders for now.
  const isSuccess = order.status !== 'FAILED' && order.status !== 'CANCELLED'; 

  return (
    <div className="animate-slide-up" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', textAlign: 'center' }}>
      
      {isSuccess ? (
        <>
          <CheckCircle size={100} color="var(--secondary-color)" style={{ marginBottom: '24px' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>
            {order.payment_method === 'COD' ? 'Order Confirmed!' : 'Payment Successful!'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Your order #{order.id} has been placed successfully.</p>
          
          <div className="glass" style={{ width: '100%', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
            <p style={{ margin: '0 0 8px 0', color: 'var(--text-muted)' }}>
              {order.payment_method === 'COD' ? 'Amount to Pay at Delivery' : 'Amount Paid via ' + order.payment_method}
            </p>
            <h3 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--primary-color)' }}>₹{order.total_amount}</h3>
          </div>

          <button onClick={() => navigate(`/tracking/${order.id}`)} className="btn-primary" style={{ marginBottom: '16px' }}>
            Track Order
          </button>
          <button onClick={() => navigate('/home')} className="btn-outline">
            Continue Shopping
          </button>
        </>
      ) : (
        <>
          <XCircle size={100} color="var(--primary-color)" style={{ marginBottom: '24px' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Payment Failed</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>We couldn't process your payment. Please try again.</p>
          
          <button onClick={() => navigate('/checkout')} className="btn-primary" style={{ marginBottom: '16px' }}>
            Retry Payment
          </button>
          <button onClick={() => navigate(-1)} className="btn-outline">
            Go Back
          </button>
        </>
      )}

    </div>
  );
}
