import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Tag, CheckCircle, XCircle, X } from 'lucide-react';

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Electronics', desc: 'Gadgets, phones, laptops, and smart tech items.', status: 'Active', subCount: 8, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Fashion & Apparel', desc: 'Men, women, and kids apparel, shoes, and accessories.', status: 'Active', subCount: 12, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Home & Living', desc: 'Furniture, kitchenware, home decor, and tools.', status: 'Active', subCount: 6, image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=100&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Sports & Outdoors', desc: 'Fitness equipment, sportswear, and camping gear.', status: 'Active', subCount: 5, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&auto=format&fit=crop&q=60' },
  { id: 5, name: 'Beauty & Health', desc: 'Skincare, makeup, vitamins, and wellness items.', status: 'Disabled', subCount: 4, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&auto=format&fit=crop&q=60' },
];

export default function CategoryView() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', desc: '', status: 'Active', image: '' });
  const [formError, setFormError] = useState('');

  const handleOpenAddModal = () => {
    setCurrentCategory(null);
    setFormData({ name: '', desc: '', status: 'Active', image: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setCurrentCategory(cat);
    setFormData({ name: cat.name, desc: cat.desc, status: cat.status, image: cat.image });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category? This might affect related subcategories.')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setCategories(categories.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'Active' ? 'Disabled' : 'Active' };
      }
      return c;
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    const placeholderImg = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=100&auto=format&fit=crop&q=60';
    const finalImg = formData.image.trim() || placeholderImg;

    if (currentCategory) {
      // Edit
      setCategories(categories.map(c => {
        if (c.id === currentCategory.id) {
          return { ...c, ...formData, image: finalImg };
        }
        return c;
      }));
    } else {
      // Add
      const newCat = {
        id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        ...formData,
        image: finalImg,
        subCount: 0
      };
      setCategories([...categories, newCat]);
    }

    setIsModalOpen(false);
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase())
  );

  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.status === 'Active').length;
  const disabledCategories = categories.filter(c => c.status === 'Disabled').length;

  return (
    <div className="animate-fade">
      {/* Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-title">Total Categories</div>
            <div className="stat-value">{totalCategories}</div>
          </div>
          <div className="stat-icon purple">
            <Tag size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Active Categories</div>
            <div className="stat-value">{activeCategories}</div>
          </div>
          <div className="stat-icon emerald">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Disabled Categories</div>
            <div className="stat-value">{disabledCategories}</div>
          </div>
          <div className="stat-icon amber">
            <XCircle size={24} />
          </div>
        </div>
      </div>

      {/* Categories Table Card */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title-container">
            <h2 className="table-title">Product Categories</h2>
            <span className="table-subtitle">Structure your store inventory by defining major category collections.</span>
          </div>

          <div className="table-actions">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} size={16} />
              <input
                type="text"
                placeholder="Search categories..."
                className="search-input"
                style={{ paddingLeft: '34px', width: '200px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Thumbnail & Name</th>
                <th>Description</th>
                <th>Subcategories</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <div className="avatar-cell">
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          className="avatar-img"
                        />
                        <div className="avatar-name-info">
                          <span style={{ fontWeight: 600 }}>{cat.name}</span>
                          <span className="avatar-subtext">ID: #{cat.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        maxWidth: '280px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        color: 'var(--text-secondary)'
                      }} title={cat.desc}>
                        {cat.desc || 'No description provided.'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{cat.subCount} items</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(cat.id)}
                        className={`badge ${cat.status === 'Active' ? 'badge-success' : 'badge-danger'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle status"
                      >
                        {cat.status}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary btn-icon-only" 
                          onClick={() => handleOpenEditModal(cat)}
                          title="Edit Category"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="btn btn-danger btn-icon-only" 
                          onClick={() => handleDelete(cat.id)}
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{currentCategory ? 'Edit Category' : 'Create Category'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                {formError && (
                  <div className="login-error" style={{ marginBottom: '8px' }}>
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="cat-name">Category Name</label>
                  <input
                    id="cat-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Home Decor"
                    style={{ paddingLeft: '14px' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cat-desc">Description</label>
                  <textarea
                    id="cat-desc"
                    className="form-input"
                    placeholder="Provide a brief description..."
                    style={{ paddingLeft: '14px', height: '90px', resize: 'vertical' }}
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cat-image">Image URL (Optional)</label>
                  <input
                    id="cat-image"
                    type="text"
                    className="form-input"
                    placeholder="https://unsplash.com/..."
                    style={{ paddingLeft: '14px' }}
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cat-status">Status</label>
                  <select
                    id="cat-status"
                    className="form-input"
                    style={{ paddingLeft: '14px', background: 'var(--bg-tertiary)' }}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
