import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, X } from 'lucide-react';
import { api, AuthContext } from '../../context/AuthContext';

export default function AdminProductsScreen() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: '', original_price: '', discount_price: '0', unit: '1kg', stock: '', description: '',
    is_active: true, is_featured: false, is_bestseller: false, is_seasonal: false, is_recommended: false
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const prodRes = await api.get('products/');
      setProducts(prodRes.data);
      const catRes = await api.get('categories/');
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);
    
    try {
      await api.post('products/', data, { headers: { 'Content-Type': 'multipart/form-data' }});
      setShowModal(false);
      setFormData({
        name: '', category: '', original_price: '', discount_price: '0', unit: '1kg', stock: '', description: '',
        is_active: true, is_featured: false, is_bestseller: false, is_seasonal: false, is_recommended: false
      });
      setImageFile(null);
      fetchData();
    } catch(err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this product?')) {
      await api.delete(`products/${id}/`);
      fetchData();
    }
  };

  const toggleActive = async (product) => {
    try {
      await api.patch(`products/${product.id}/`, { is_active: !product.is_active });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
      {/* Header */}
      <div style={{ padding: '24px', background: 'var(--surface-color)', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none' }}>
            <ArrowLeft size={24} color="var(--text-main)" />
          </button>
          <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Manage Products</h2>
          <div style={{ width: 24 }} />
        </div>
        
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ background: 'var(--text-main)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Add New Product
        </button>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {products.length === 0 && <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>No products added yet.</p>}
        {products.map((product) => (
          <div key={product.id} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '16px', opacity: product.is_active ? 1 : 0.5 }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px', overflow: 'hidden' }}>
              {product.image ? <img src={product.image} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : '📦'}
            </div>
            
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{product.name}</h4>
              <p style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Stock: {product.stock} {product.unit}</p>
              <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>₹{product.price}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => toggleActive(product)} style={{ background: 'transparent', border: 'none', color: product.is_active ? 'var(--primary-color)' : 'gray', padding: '4px', fontSize: '0.7rem' }}>
                {product.is_active ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => handleDelete(product.id)} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', padding: '4px' }}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-color)', width: '100%', borderRadius: '24px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3>Add Product</h3>
              <button onClick={() => setShowModal(false)} style={{background:'none', border:'none'}}><X /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input required placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)'}} />
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)'}}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input required type="number" placeholder="Original Price (₹)" value={formData.original_price} onChange={e => setFormData({...formData, original_price: e.target.value})} style={{padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)'}} />
              <input type="number" placeholder="Discount Price (₹)" value={formData.discount_price} onChange={e => setFormData({...formData, discount_price: e.target.value})} style={{padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)'}} />
              <input required placeholder="Unit (e.g. 1kg, 1 box)" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} style={{padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)'}} />
              <input required type="number" placeholder="Stock Quantity" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={{padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)'}} />
              <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)'}} />
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <label><input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} /> Featured</label>
                <label><input type="checkbox" checked={formData.is_bestseller} onChange={e => setFormData({...formData, is_bestseller: e.target.checked})} /> Best Seller</label>
                <label><input type="checkbox" checked={formData.is_seasonal} onChange={e => setFormData({...formData, is_seasonal: e.target.checked})} /> Seasonal</label>
                <label><input type="checkbox" checked={formData.is_recommended} onChange={e => setFormData({...formData, is_recommended: e.target.checked})} /> Recommended</label>
              </div>

              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              <button type="submit" className="btn-primary">Save Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
