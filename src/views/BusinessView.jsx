import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Building2, CheckCircle2, AlertTriangle, X, Star } from 'lucide-react';

const INITIAL_BUSINESSES = [
  { id: 1, name: 'TechMart Solutions', owner: 'Alex Mercer', category: 'Electronics', status: 'Approved', contact: 'contact@techmart.com', rating: 4.8 },
  { id: 2, name: 'Urban Chic Boutique', owner: 'Sarah Connor', category: 'Fashion & Apparel', status: 'Approved', contact: 'sales@urbanchic.com', rating: 4.5 },
  { id: 3, name: 'Healthy Bites Cafe', owner: 'David Miller', category: 'Food & Dining', status: 'Pending', contact: 'info@healthybites.com', rating: 0 },
  { id: 4, name: 'ProFit Gym', owner: 'Marcus Aurelius', category: 'Sports & Outdoors', status: 'Suspended', contact: 'membership@profitgym.com', rating: 4.2 },
];

export default function BusinessView() {
  const [businesses, setBusinesses] = useState(INITIAL_BUSINESSES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBiz, setCurrentBiz] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', owner: '', category: 'Electronics', status: 'Pending', contact: '' });
  const [formError, setFormError] = useState('');

  const handleOpenAddModal = () => {
    setCurrentBiz(null);
    setFormData({ name: '', owner: '', category: 'Electronics', status: 'Pending', contact: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (biz) => {
    setCurrentBiz(biz);
    setFormData({ name: biz.name, owner: biz.owner, category: biz.category, status: biz.status, contact: biz.contact });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      setBusinesses(businesses.filter(b => b.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setBusinesses(businesses.map(b => {
      if (b.id === id) {
        let nextStatus = 'Approved';
        if (b.status === 'Approved') nextStatus = 'Suspended';
        else if (b.status === 'Suspended') nextStatus = 'Pending';
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.owner.trim() || !formData.contact.trim()) {
      setFormError('Business name, owner name, and contact are required.');
      return;
    }

    if (currentBiz) {
      // Edit
      setBusinesses(businesses.map(b => {
        if (b.id === currentBiz.id) {
          return { ...b, ...formData };
        }
        return b;
      }));
    } else {
      // Add
      const newBiz = {
        id: businesses.length ? Math.max(...businesses.map(b => b.id)) + 1 : 1,
        ...formData,
        rating: 0
      };
      setBusinesses([...businesses, newBiz]);
    }

    setIsModalOpen(false);
  };

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
                          b.owner.toLowerCase().includes(search.toLowerCase()) ||
                          b.contact.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBiz = businesses.length;
  const approvedBiz = businesses.filter(b => b.status === 'Approved').length;
  const pendingBiz = businesses.filter(b => b.status === 'Pending').length;

  return (
    <div className="animate-fade">
      {/* Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-title">Total Businesses</div>
            <div className="stat-value">{totalBiz}</div>
          </div>
          <div className="stat-icon blue">
            <Building2 size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Approved Partners</div>
            <div className="stat-value">{approvedBiz}</div>
          </div>
          <div className="stat-icon emerald">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Pending Verifications</div>
            <div className="stat-value">{pendingBiz}</div>
          </div>
          <div className="stat-icon amber">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Businesses Table Card */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title-container">
            <h2 className="table-title">Business Directory</h2>
            <span className="table-subtitle">Verify merchant credentials, review rating feeds, and manage partner status.</span>
          </div>

          <div className="table-actions">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} size={16} />
              <input
                type="text"
                placeholder="Search business, owner..."
                className="search-input"
                style={{ paddingLeft: '34px', width: '200px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="search-input"
              style={{ width: '140px', paddingLeft: '10px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>

            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={16} />
              <span>Add Business</span>
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Business Profile</th>
                <th>Category</th>
                <th>Contact</th>
                <th>Rating</th>
                <th>Verification</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No businesses found matching filters.
                  </td>
                </tr>
              ) : (
                filteredBusinesses.map((biz) => (
                  <tr key={biz.id}>
                    <td>
                      <div className="avatar-cell">
                        <div className="avatar-circle" style={{ borderRadius: 'var(--border-radius-md)', background: 'var(--bg-tertiary)', color: 'var(--accent-primary)' }}>
                          <Building2 size={16} />
                        </div>
                        <div className="avatar-name-info">
                          <span style={{ fontWeight: 600 }}>{biz.name}</span>
                          <span className="avatar-subtext">Owner: {biz.owner}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-muted">{biz.category}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{biz.contact}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} fill={biz.rating > 0 ? 'var(--accent-warning)' : 'none'} stroke={biz.rating > 0 ? 'var(--accent-warning)' : 'var(--text-muted)'} />
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{biz.rating > 0 ? biz.rating.toFixed(1) : 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(biz.id)}
                        className={`badge ${
                          biz.status === 'Approved' ? 'badge-success' :
                          biz.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                        }`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle: Approved -> Suspended -> Pending"
                      >
                        {biz.status}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary btn-icon-only" 
                          onClick={() => handleOpenEditModal(biz)}
                          title="Edit Business"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="btn btn-danger btn-icon-only" 
                          onClick={() => handleDelete(biz.id)}
                          title="Delete Business"
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

      {/* Business Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{currentBiz ? 'Edit Business Details' : 'Register New Business'}</h3>
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
                  <label className="form-label" htmlFor="biz-name">Business Name</label>
                  <input
                    id="biz-name"
                    type="text"
                    className="form-input"
                    placeholder="Enter store/company name"
                    style={{ paddingLeft: '14px' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="biz-owner">Owner Full Name</label>
                  <input
                    id="biz-owner"
                    type="text"
                    className="form-input"
                    placeholder="Owner's full name"
                    style={{ paddingLeft: '14px' }}
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="biz-contact">Contact Email</label>
                  <input
                    id="biz-contact"
                    type="email"
                    className="form-input"
                    placeholder="business@example.com"
                    style={{ paddingLeft: '14px' }}
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="biz-cat">Category Segment</label>
                  <select
                    id="biz-cat"
                    className="form-input"
                    style={{ paddingLeft: '14px', background: 'var(--bg-tertiary)' }}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                    <option value="Food & Dining">Food & Dining</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="biz-status">Verification Status</label>
                  <select
                    id="biz-status"
                    className="form-input"
                    style={{ paddingLeft: '14px', background: 'var(--bg-tertiary)' }}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Pending">Pending Approval</option>
                    <option value="Approved">Approved / Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentBiz ? 'Save Changes' : 'Register Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
