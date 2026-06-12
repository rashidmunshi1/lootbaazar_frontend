import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Layers, CheckCircle, XCircle, X } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Fashion & Apparel', 'Home & Living', 'Sports & Outdoors'];

const INITIAL_SUBCATEGORIES = [
  { id: 1, name: 'Mobile Phones', parent: 'Electronics', desc: 'Smartphones and cell devices.', status: 'Active', productCount: 42 },
  { id: 2, name: 'Laptops', parent: 'Electronics', desc: 'Notebooks, netbooks, and gaming laptops.', status: 'Active', productCount: 28 },
  { id: 3, name: 'Mens Wear', parent: 'Fashion & Apparel', desc: 'T-shirts, shirts, trousers, and suits.', status: 'Active', productCount: 85 },
  { id: 4, name: 'Womens Wear', parent: 'Fashion & Apparel', desc: 'Dresses, tops, skirts, and activewear.', status: 'Active', productCount: 110 },
  { id: 5, name: 'Kitchenware', parent: 'Home & Living', desc: 'Pots, pans, utensils, and cooktops.', status: 'Active', productCount: 19 },
  { id: 6, name: 'Gym Equipment', parent: 'Sports & Outdoors', desc: 'Treadmills, dumbells, and benches.', status: 'Disabled', productCount: 4 },
];

export default function SubcategoryView() {
  const [subcategories, setSubcategories] = useState(INITIAL_SUBCATEGORIES);
  const [search, setSearch] = useState('');
  const [parentFilter, setParentFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSub, setCurrentSub] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', parent: 'Electronics', desc: '', status: 'Active' });
  const [formError, setFormError] = useState('');

  const handleOpenAddModal = () => {
    setCurrentSub(null);
    setFormData({ name: '', parent: CATEGORIES[0], desc: '', status: 'Active' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sub) => {
    setCurrentSub(sub);
    setFormData({ name: sub.name, parent: sub.parent, desc: sub.desc, status: sub.status });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      setSubcategories(subcategories.filter(s => s.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setSubcategories(subcategories.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'Active' ? 'Disabled' : 'Active' };
      }
      return s;
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Subcategory name is required.');
      return;
    }

    if (currentSub) {
      // Edit
      setSubcategories(subcategories.map(s => {
        if (s.id === currentSub.id) {
          return { ...s, ...formData };
        }
        return s;
      }));
    } else {
      // Add
      const newSub = {
        id: subcategories.length ? Math.max(...subcategories.map(s => s.id)) + 1 : 1,
        ...formData,
        productCount: 0
      };
      setSubcategories([...subcategories, newSub]);
    }

    setIsModalOpen(false);
  };

  const filteredSubs = subcategories.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(search.toLowerCase()) ||
                          sub.desc.toLowerCase().includes(search.toLowerCase());
    const matchesParent = parentFilter === 'All' || sub.parent === parentFilter;
    return matchesSearch && matchesParent;
  });

  const totalSubs = subcategories.length;
  const activeSubs = subcategories.filter(s => s.status === 'Active').length;
  const disabledSubs = subcategories.filter(s => s.status === 'Disabled').length;

  return (
    <div className="animate-fade">
      {/* Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-title">Total Subcategories</div>
            <div className="stat-value">{totalSubs}</div>
          </div>
          <div className="stat-icon purple">
            <Layers size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Active Subcategories</div>
            <div className="stat-value">{activeSubs}</div>
          </div>
          <div className="stat-icon emerald">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Disabled Subcategories</div>
            <div className="stat-value">{disabledSubs}</div>
          </div>
          <div className="stat-icon amber">
            <XCircle size={24} />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title-container">
            <h2 className="table-title">Product Subcategories</h2>
            <span className="table-subtitle">Group related items into finer segments linked directly to parent classes.</span>
          </div>

          <div className="table-actions">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} size={16} />
              <input
                type="text"
                placeholder="Search subcategories..."
                className="search-input"
                style={{ paddingLeft: '34px', width: '200px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="search-input"
              style={{ width: '150px', paddingLeft: '10px' }}
              value={parentFilter}
              onChange={(e) => setParentFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={16} />
              <span>Add Subcategory</span>
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Subcategory Name</th>
                <th>Parent Category</th>
                <th>Description</th>
                <th>Products Count</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No subcategories found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => (
                  <tr key={sub.id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{sub.id}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{sub.name}</span>
                    </td>
                    <td>
                      <span className="badge badge-info">{sub.parent}</span>
                    </td>
                    <td>
                      <div style={{ 
                        maxWidth: '240px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        color: 'var(--text-secondary)'
                      }} title={sub.desc}>
                        {sub.desc || 'No description.'}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{sub.productCount} items</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(sub.id)}
                        className={`badge ${sub.status === 'Active' ? 'badge-success' : 'badge-danger'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle status"
                      >
                        {sub.status}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary btn-icon-only" 
                          onClick={() => handleOpenEditModal(sub)}
                          title="Edit Subcategory"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="btn btn-danger btn-icon-only" 
                          onClick={() => handleDelete(sub.id)}
                          title="Delete Subcategory"
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

      {/* Subcategory Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{currentSub ? 'Edit Subcategory' : 'Create Subcategory'}</h3>
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
                  <label className="form-label" htmlFor="sub-name">Subcategory Name</label>
                  <input
                    id="sub-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Headphones"
                    style={{ paddingLeft: '14px' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="sub-parent">Parent Category</label>
                  <select
                    id="sub-parent"
                    className="form-input"
                    style={{ paddingLeft: '14px', background: 'var(--bg-tertiary)' }}
                    value={formData.parent}
                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="sub-desc">Description</label>
                  <textarea
                    id="sub-desc"
                    className="form-input"
                    placeholder="Provide a brief description..."
                    style={{ paddingLeft: '14px', height: '90px', resize: 'vertical' }}
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="sub-status">Status</label>
                  <select
                    id="sub-status"
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
                  {currentSub ? 'Save Changes' : 'Create Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
