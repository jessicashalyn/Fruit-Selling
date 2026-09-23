import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Calendar, Download, PieChart } from 'lucide-react';

export default function AdminReportsScreen() {
  const navigate = useNavigate();

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
      {/* Header */}
      <div style={{ padding: '24px', background: 'var(--text-main)', color: 'white', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none' }}>
            <ArrowLeft size={24} color="white" />
          </button>
          <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Analytics</h2>
          <button style={{ background: 'transparent', border: 'none' }}>
            <Download size={24} color="white" />
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '12px', width: 'fit-content', margin: '0 auto' }}>
          <Calendar size={16} />
          <span style={{ fontSize: '0.9rem' }}>This Week: Sept 14 - Sept 21</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Revenue Overview */}
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', color: 'var(--text-muted)' }}>Total Revenue</p>
              <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--primary-color)' }}>₹45,200</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00b894', background: 'rgba(0,184,148,0.1)', padding: '4px 8px', borderRadius: '8px' }}>
              <TrendingUp size={16} />
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>+12%</span>
            </div>
          </div>
          
          {/* Mock Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px', marginTop: '24px' }}>
            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', height: `${h}%`, background: h === 90 ? 'var(--primary-color)' : 'var(--primary-light)', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{['M','T','W','T','F','S','S'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <PieChart size={20} color="var(--text-main)" />
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Top Products</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { name: 'Kashmir Apples', sold: 124, rev: '₹14,880', img: '🍎', pct: 80 },
              { name: 'Organic Bananas', sold: 89, rev: '₹5,340', img: '🍌', pct: 60 },
              { name: 'Dragon Fruit', sold: 45, rev: '₹11,250', img: '🐉', pct: 40 },
            ].map(item => (
              <div key={item.name} className="glass" style={{ padding: '16px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '2rem' }}>{item.img}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0' }}>{item.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.sold} units sold • {item.rev}</p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', background: 'var(--secondary-color)', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
