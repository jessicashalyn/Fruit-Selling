import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, Package, DollarSign, LogOut, ChevronRight, Grid } from 'lucide-react';
import { api, AuthContext } from '../../context/AuthContext';

export default function AdminDashboardScreen() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total_revenue: 0,
    active_orders: 0,
    total_products: 0,
    delivery_partners: 0
  });

  useEffect(() => {
    api.get('admin/dashboard/')
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching dashboard stats:", err));
  }, []);

  const displayStats = [
    { label: 'Total Revenue', value: `₹${stats.total_revenue}`, icon: <DollarSign color="var(--secondary-color)" /> },
    { label: 'Active Orders', value: stats.active_orders, icon: <ShoppingBag color="var(--primary-color)" /> },
    { label: 'Total Products', value: stats.total_products, icon: <Package color="var(--accent-color)" /> },
    { label: 'Delivery Partners', value: stats.delivery_partners, icon: <Users color="#a29bfe" /> },
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Header section */}
      <div style={{ background: 'var(--text-main)', color: 'white', padding: '24px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem' }}>Admin Dashboard</h2>
            <p style={{ margin: 0, opacity: 0.7 }}>Welcome back, Superadmin</p>
          </div>
          <button onClick={logout} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LogOut color="white" size={20} />
          </button>
        </div>
        
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {displayStats.map((stat, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.4rem' }}>{stat.value}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions List */}
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>Management</h3>
        
        <div onClick={() => navigate('/admin/categories')} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '16px', cursor: 'pointer' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px' }}>
            <Grid color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 4px 0' }}>Categories</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage product categories</p>
          </div>
          <ChevronRight color="var(--text-muted)" />
        </div>

        <div onClick={() => navigate('/admin/products')} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '16px', cursor: 'pointer' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px' }}>
            <Package color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 4px 0' }}>Products</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Add, edit, or remove inventory</p>
          </div>
          <ChevronRight color="var(--text-muted)" />
        </div>

        <div onClick={() => navigate('/admin/orders')} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '16px', cursor: 'pointer' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ffeaa7', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px' }}>
            <ShoppingBag color="#fdcb6e" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 4px 0' }}>Orders & Tracking</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>View active and past orders</p>
          </div>
          <ChevronRight color="var(--text-muted)" />
        </div>

        <div onClick={() => navigate('/admin/partners')} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '16px', cursor: 'pointer' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#55efc4', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px' }}>
            <Users color="#00b894" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 4px 0' }}>Delivery Partners</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage riders and assignments</p>
          </div>
          <ChevronRight color="var(--text-muted)" />
        </div>
      </div>
    </div>
  );
}
