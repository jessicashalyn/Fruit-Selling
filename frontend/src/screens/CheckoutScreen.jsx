import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, CheckCircle, Clock, ChevronDown, ChevronUp, Package, Home, Briefcase, Map, Plus } from 'lucide-react';
import { api, AuthContext } from '../context/AuthContext';

export default function CheckoutScreen() {
  const navigate = useNavigate();
  const { token, role } = useContext(AuthContext);
  
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  
  // Accordion Step State (1: Address, 2: Summary, 3: Payment)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form State
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cartRes, addressRes] = await Promise.all([
        api.get('carts/my_cart/'),
        api.get('addresses/')
      ]);
      setCart(cartRes.data);
      setAddresses(addressRes.data);
      if (addressRes.data.length > 0) {
        // Select default address if exists, otherwise first one
        const defaultAddr = addressRes.data.find(a => a.is_default);
        setSelectedAddressId(defaultAddr ? defaultAddr.id : addressRes.data[0].id);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'HOME': return <Home size={18} />;
      case 'WORK': return <Briefcase size={18} />;
      default: return <Map size={18} />;
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart) return;
    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      setCurrentStep(1);
      return;
    }
    
    // Validations
    if (paymentMethod === 'UPI' && !upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g., name@upi)');
      return;
    }
    if (paymentMethod === 'Card') {
      if (cardNumber.length < 16) {
        alert('Please enter a valid 16-digit card number');
        return;
      }
      if (cardExpiry.length < 5) {
        alert('Please enter a valid expiry date (MM/YY)');
        return;
      }
      if (cardCvv.length < 3) {
        alert('Please enter a valid CVV');
        return;
      }
    }

    setPlacingOrder(true);
    try {
      let mappedPaymentMethod = paymentMethod;
      if (paymentMethod === 'Card') mappedPaymentMethod = 'CARD';
      if (paymentMethod === 'Cash on Delivery') mappedPaymentMethod = 'COD';

      const payload = {
        subtotal: cart.total_price,
        delivery_fee: cart.total_price > 300 ? 0 : 50,
        total_amount: cart.total_price + (cart.total_price > 300 ? 0 : 50),
        payment_method: mappedPaymentMethod,
        user: cart.user,
        address: selectedAddressId
      };
      
      const res = await api.post('orders/', payload);
      
      if (mappedPaymentMethod !== 'COD') {
        const orderData = res.data;
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_razorpay_key_id_here';
        
        // MOCK FLOW FOR DUMMY KEYS
        if (razorpayKey === 'your_razorpay_key_id_here' || razorpayKey.toLowerCase().includes('dummy')) {
            alert("Mock Payment Successful! (Dummy keys detected)");
            try {
                await api.post(`orders/${orderData.id}/verify_payment/`, {
                    razorpay_payment_id: "mock_payment_id",
                    razorpay_order_id: orderData.razorpay_order_id,
                    razorpay_signature: "mock_signature"
                });
                navigate(`/payment-result/${orderData.id}`);
            } catch (verifyErr) {
                console.error(verifyErr);
                alert("Mock Payment verification failed!");
                setPlacingOrder(false);
            }
            return;
        }

        const options = {
          "key": razorpayKey,
          "amount": orderData.total_amount * 100, 
          "currency": "INR",
          "name": "Fruit Selling App",
          "description": "Order Payment",
          "order_id": orderData.razorpay_order_id, 
          "handler": async function (response) {
              try {
                  await api.post(`orders/${orderData.id}/verify_payment/`, {
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_signature: response.razorpay_signature
                  });
                  navigate(`/payment-result/${orderData.id}`);
              } catch (verifyErr) {
                  console.error(verifyErr);
                  alert("Payment verification failed!");
                  setPlacingOrder(false);
              }
          },
          "prefill": {
              "name": "Customer",
              "contact": "9999999999"
          },
          "theme": {
              "color": "#22a05f"
          },
          "modal": {
              "ondismiss": function() {
                  setPlacingOrder(false);
              }
          }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        navigate(`/payment-result/${res.data.id}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error placing order');
      setPlacingOrder(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (!cart) return <div>Cart not found.</div>;

  const total = cart.total_price + (cart.total_price > 300 ? 0 : 50);

  const StepHeader = ({ stepNum, title, isCompleted }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: isCompleted ? 'var(--primary-color)' : currentStep === stepNum ? 'var(--text-main)' : 'var(--border-color)', color: isCompleted ? 'white' : currentStep === stepNum ? 'white' : 'var(--text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
        {isCompleted ? <CheckCircle size={16} /> : stepNum}
      </div>
      <h3 style={{ margin: 0, fontSize: '1.1rem', color: currentStep === stepNum ? 'var(--text-main)' : 'var(--text-muted)' }}>{title}</h3>
    </div>
  );

  return (
    <div style={{ padding: '24px', height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto', backgroundColor: 'var(--bg-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Secure Checkout</h2>
        <div style={{ width: 24 }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Step 1: Delivery Address */}
        <div className="glass" style={{ padding: '20px', borderRadius: '16px', border: currentStep === 1 ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', transition: 'all 0.3s' }}>
          <div onClick={() => setCurrentStep(1)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <StepHeader stepNum={1} title="Delivery Address" isCompleted={currentStep > 1 && selectedAddressId} />
            {currentStep !== 1 && <ChevronDown size={20} color="var(--text-muted)" />}
          </div>
          
          {currentStep === 1 && (
            <div className="animate-slide-up" style={{ marginTop: '20px' }}>
              {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>You haven't saved any addresses yet.</p>
                  <button onClick={() => navigate('/addresses')} className="btn-outline">Add an Address</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {addresses.map(addr => (
                    <label key={addr.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', borderRadius: '12px', border: selectedAddressId === addr.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', backgroundColor: selectedAddressId === addr.id ? 'var(--primary-light)' : 'var(--surface-color)', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <input 
                        type="radio" 
                        name="address" 
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        style={{ marginTop: '4px', accentColor: 'var(--primary-color)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: selectedAddressId === addr.id ? 'white' : 'var(--text-main)' }}>
                            {getIconForType(addr.address_type)} {addr.address_type}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: selectedAddressId === addr.id ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)', lineHeight: '1.4' }}>
                          {addr.street_address}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                    </label>
                  ))}
                  <button onClick={() => navigate('/addresses')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--primary-color)', fontWeight: 600, padding: '8px 0', cursor: 'pointer' }}>
                    <Plus size={18} /> Add New Address
                  </button>
                </div>
              )}
              
              <button 
                onClick={() => setCurrentStep(2)} 
                className="btn-primary" 
                style={{ marginTop: '20px' }}
                disabled={!selectedAddressId}
              >
                Use this address
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Order Summary */}
        <div className="glass" style={{ padding: '20px', borderRadius: '16px', border: currentStep === 2 ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', transition: 'all 0.3s' }}>
          <div onClick={() => selectedAddressId && setCurrentStep(2)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: selectedAddressId ? 'pointer' : 'default' }}>
            <StepHeader stepNum={2} title="Order Summary" isCompleted={currentStep > 2} />
            {currentStep !== 2 && <ChevronDown size={20} color="var(--text-muted)" />}
          </div>

          {currentStep === 2 && (
            <div className="animate-slide-up" style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                {cart.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'var(--surface-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        {item.image_url ? <img src={item.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={24} color="var(--text-muted)" />}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{item.product_name}</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} • {item.unit}</p>
                      </div>
                    </div>
                    <span style={{ fontWeight: 600 }}>₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Subtotal:</span>
                <span>₹{cart.total_price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery Fee:</span>
                <span>{cart.total_price > 300 ? 'Free' : '₹50'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                <span>Order Total:</span>
                <span>₹{total}</span>
              </div>
              
              <button onClick={() => setCurrentStep(3)} className="btn-primary" style={{ marginTop: '20px' }}>
                Continue to Payment
              </button>
            </div>
          )}
        </div>

        {/* Step 3: Payment Method */}
        <div className="glass" style={{ padding: '20px', borderRadius: '16px', border: currentStep === 3 ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', transition: 'all 0.3s' }}>
          <div onClick={() => currentStep > 2 && setCurrentStep(3)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: currentStep > 2 ? 'pointer' : 'default' }}>
            <StepHeader stepNum={3} title="Payment Method" isCompleted={false} />
            {currentStep !== 3 && <ChevronDown size={20} color="var(--text-muted)" />}
          </div>

          {currentStep === 3 && (
            <div className="animate-slide-up" style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['UPI', 'Card', 'Cash on Delivery'].map(method => (
                  <div key={method} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div 
                      onClick={() => setPaymentMethod(method)}
                      style={{ 
                        padding: '16px', 
                        borderRadius: '12px', 
                        background: paymentMethod === method ? 'var(--primary-light)' : 'var(--surface-color)',
                        border: paymentMethod === method ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                    >
                      <CreditCard color={paymentMethod === method ? '#fff' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: 600, color: paymentMethod === method ? '#fff' : 'var(--text-main)' }}>{method}</span>
                    </div>

                    {paymentMethod === method && method === 'UPI' && (
                      <div className="glass animate-slide-up" style={{ padding: '16px', borderRadius: '12px', marginTop: '4px' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Enter your UPI ID</p>
                        <input 
                          type="text" 
                          placeholder="e.g., username@upi" 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
                        />
                      </div>
                    )}

                    {paymentMethod === method && method === 'Card' && (
                      <div className="glass animate-slide-up" style={{ padding: '16px', borderRadius: '12px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input 
                          type="text" 
                          placeholder="Card Number (16 digits)" 
                          maxLength="16"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
                        />
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <input 
                            type="text" 
                            placeholder="MM/YY" 
                            maxLength="5"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
                          />
                          <input 
                            type="password" 
                            placeholder="CVV" 
                            maxLength="3"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={handlePlaceOrder} 
                className="btn-primary" 
                style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: placingOrder ? 0.7 : 1 }}
                disabled={placingOrder}
              >
                {placingOrder ? 'Processing...' : `Place Order and Pay ₹${total}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
