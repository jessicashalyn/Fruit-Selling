import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, X } from 'lucide-react';
import { api } from '../../context/AuthContext';

export default function AdminCategoriesScreen() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', is_active: true
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('categories/');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('is_active', formData.is_active);
    if (imageFile) data.append('image', imageFile);
    
    try {
      await api.post('categories/', data, { headers: { 'Content-Type': 'multipart/form-data' }});
      setShowModal(false);
      setFormData({ name: '', description: '', is_active: true });
      setImageFile(null);
      fetchCategories();
    } catch(err) {
      console.error(err);
      alert("Error adding category");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this category?')) {
      try {
        await api.delete(`categories/${id}/`);
        fetchCategories();
      } catch (err) {
        console.error(err);
        alert("Cannot delete category. It may have products attached.");
      }
    }
  };

  const toggleActive = async (cat) => {
    try {
      await api.patch(`categories/${cat.id}/`, { is_active: !cat.is_active });
      fetchCategories();
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
          <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Manage Categories</h2>
          <div style={{ width: 24 }} />
        </div>
        
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ background: 'var(--text-main)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Add New Category
        </button>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {categories.length === 0 && <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>No categories added yet.</p>}
        {categories.map((cat) => (
          <div key={cat.id} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '16px', opacity: cat.is_active ? 1 : 0.5 }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px', overflow: 'hidden' }}>
              {cat.image ? <img src={cat.image} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : '📁'}
            </div>
            
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{cat.name}</h4>
              <p style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{cat.is_active ? 'Active' : 'Inactive'}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => toggleActive(cat)} style={{ background: 'transparent', border: 'none', color: cat.is_active ? 'var(--primary-color)' : 'gray', padding: '4px', fontSize: '0.7rem' }}>
                {cat.is_active ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => handleDelete(cat.id)} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', padding: '4px' }}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-color)', width: '100%', borderRadius: '24px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3>Add Category</h3>
              <button onClick={() => setShowModal(false)} style={{background:'none', border:'none'}}><X /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input required placeholder="Category Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)'}} />
              <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)'}} />
              
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              
              <button type="submit" className="btn-primary">Save Category</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
