import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Tag, Hash, X, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/frontend';
const API_KEY = process.env.REACT_APP_API_KEY || 'lootbaazarV5kAYC7SJhFGWEnWynVjHW0UU7kA8N9x';

export default function CategoryView() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', order: 0 });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load categories from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setCurrentCategory(null);
    setFormData({ name: '', order: categories.length ? Math.max(...categories.map(c => c.order || 0)) + 1 : 1 });
    setImageFile(null);
    setImagePreview('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setCurrentCategory(cat);
    setFormData({ name: cat.name, order: cat.order || 0 });
    setImageFile(null);
    setImagePreview(cat.image || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/categories/${id}/delete`, {
          method: 'DELETE',
          headers: {
            'x-api-key': API_KEY
          }
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || 'Failed to delete category');
        }
        fetchCategories();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('order', String(formData.order || 0));
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      setIsSaving(true);
      if (currentCategory) {
        // Edit API call
        const res = await fetch(`${API_BASE_URL}/categories/${currentCategory._id}/update`, {
          method: 'PUT',
          headers: {
            'x-api-key': API_KEY
          },
          body: data
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || 'Failed to update category');
        }
      } else {
        // Add API call
        const res = await fetch(`${API_BASE_URL}/categories/store`, {
          method: 'POST',
          headers: {
            'x-api-key': API_KEY
          },
          body: data
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || 'Failed to add category');
        }
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalCategories = categories.length;
  const maxOrder = categories.length ? Math.max(...categories.map(c => c.order || 0)) : 0;

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
            <div className="stat-title">Highest Order</div>
            <div className="stat-value">{maxOrder}</div>
          </div>
          <div className="stat-icon emerald">
            <Hash size={24} />
          </div>
        </div>
      </div>

      {error && (
        <div className="login-error" style={{ marginBottom: '16px', padding: '12px' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Categories Table Card */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title-container">
            <h2 className="table-title">Product Categories</h2>
            <span className="table-subtitle">Structure your store inventory by defining major category collections and ordering them.</span>
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
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading categories...
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Category ID</th>
                  <th>Category Name</th>
                  <th>Category Order</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat._id}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                        #{cat._id}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {cat.image ? (
                            <img 
                              src={cat.image} 
                              alt={cat.name} 
                              style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color, #323546)' }} 
                            />
                          ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color, #323546)' }}>
                              <Tag size={16} />
                            </div>
                          )}
                          <span style={{ fontWeight: 600 }}>{cat.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ fontWeight: 600 }}>{cat.order || 0}</span>
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
                            onClick={() => handleDelete(cat._id)}
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
          )}
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
                  <label className="form-label" htmlFor="cat-image">Category Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {imagePreview && (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color, #323546)' }} 
                      />
                    )}
                    <input
                      id="cat-image"
                      type="file"
                      accept="image/*"
                      className="form-input"
                      style={{ padding: '6px' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cat-order">Category Order</label>
                  <input
                    id="cat-order"
                    type="number"
                    className="form-input"
                    placeholder="e.g. 1"
                    style={{ paddingLeft: '14px' }}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    currentCategory ? 'Save Changes' : 'Create Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
