import React, { useState } from 'react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');

  const products = [
    { id: 1, name: 'Gold Ring', category: 'Ring', desc: '22K Plain • 5g • 22K', price: '35000', status: 'Available' },
    { id: 2, name: 'Gold Necklace', category: 'Necklace', desc: '18K Designer • 25g • 18K', price: '175000', status: 'Available' }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', color: '#333', paddingBottom: '30px' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1b4d3e', color: '#ffffff', padding: '15px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>✨ S.K. Jewellers, नेहला ✨</h2>
        <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.9 }}>शुद्धता और भरोसे का प्रतीक - बेहतरीन आभूषणों की विशाल रेंज।</p>
      </div>

      {/* Quick Action Links */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '15px 0', fontSize: '14px' }}>
        <a href="tel:9896102704" style={{ color: '#1b4d3e', textDecoration: 'none', fontWeight: 'bold' }}>📞 Call Now</a>
        <a href="https://wa.me" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 'bold' }}>💬 WhatsApp</a>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '0 15px', marginBottom: '20px' }}>
        {['all', 'Ring', 'Necklace', 'Earrings', 'Bangles'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: activeCategory === cat ? 'none' : '1px solid #e0e0e0',
              backgroundColor: activeCategory === cat ? '#1b4d3e' : '#f5f5f5',
              color: activeCategory === cat ? '#fff' : '#333',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {cat === 'all' ? 'सभी आभूषण' : cat}
          </button>
        ))}
      </div>

      {/* Section Title */}
      <div style={{ padding: '0 15px', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#1b4d3e' }}>💎 हमारी विशेष ज्वेलरी वैरायटी</h3>
        <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#666' }}>पसंद का आभूषण चुनें, लाइक करें और सीधे WhatsApp पर शेयर करें।</p>
      </div>

      {/* Product List - Beautiful Cards Like Nursery App */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', padding: '0 15px' }}>
        {products
          .filter(p => activeCategory === 'all' || p.category === activeCategory)
          .map((product) => (
            <div key={product.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'relative' }}>
              
              {/* Product Label Anchor */}
              <div style={{ fontSize: '11px', color: '#999', marginBottom: '6px', textAlign: 'right' }}>✨ S.K. Jewellers, नेहला</div>
              
              {/* Image Placeholder Frame */}
              <div style={{ width: '100%', height: '160px', backgroundColor: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifycenter: 'center', border: '1px dashed #e2e8f0', color: '#94a3b8', fontSize: '13px', marginBottom: '10px' }}>
                📷 {product.name} की फोटो यहाँ दिखाई देगी
              </div>

              {/* Tag / Category */}
              <span style={{ fontSize: '11px', backgroundColor: '#eef2f6', color: '#1b4d3e', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{product.category}</span>
              
              {/* Product Title & Specs */}
              <h4 style={{ margin: '8px 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>{product.name}</h4>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#64748b' }}>{product.desc}</p>
              
              {/* Price & Availability Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111' }}>₹{parseInt(product.price).toLocaleString('en-IN')}</span>
                <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 'bold' }}>● {product.status}</span>
              </div>

              {/* Action Buttons Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px' }}>
                <button style={{ backgroundColor: '#1b4d3e', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🟢 Details</button>
                <button style={{ backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>💬 WhatsApp</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>🤍 Like</button>
                <button style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>📢 Share</button>
              </div>

            </div>
          ))}
      </div>
    </div>
  );
}
