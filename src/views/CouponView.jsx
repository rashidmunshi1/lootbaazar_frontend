import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Ticket, Percent, X, Calendar, DollarSign, Power } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/frontend';
const API_KEY = process.env.REACT_APP_API_KEY || 'lootbaazarV5kAYC7SJhFGWEnWynVjHW0UU7kA8N9x';

export default function CouponView() {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    description: '',
    expiryDate: ''
  });
  const [formError, setFormError] = useState('');

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/coupons`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      if (!res.ok) throw new Error('Failed to fetch coupons');
      const data = await res.json();
      setCoupons(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load coupons from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenAddModal = () => {
    setCurrentCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderValue: '0',
      description: '',
      expiryDate: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon) => {
    setCurrentCoupon(coupon);
    let formattedDate = '';
    if (coupon.expiryDate) {
      formattedDate = new Date(coupon.expiryDate).toISOString().split('T')[0];
    }
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue || '0',
      description: coupon.description || '',
      expiryDate: formattedDate
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/coupons/${id}/delete`, {
          method: 'DELETE',
          headers: {
            'x-api-key': API_KEY
          }
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || 'Failed to delete coupon');
        }
        fetchCoupons();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'x-api-key': API_KEY
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.message || 'Failed to toggle status');
      }
      fetchCoupons();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.code.trim()) {
      setFormError('Coupon code is required.');
      return;
    }
    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      setFormError('Please enter a valid discount value greater than 0.');
      return;
    }
    if (formData.discountType === 'percentage' && Number(formData.discountValue) > 100) {
      setFormError('Percentage discount cannot exceed 100%.');
      return;
    }

    const payload = {
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue) || 0,
      description: formData.description,
      expiryDate: formData.expiryDate || null
    };

    try {
      if (currentCoupon) {
        // Edit API call
        const res = await fetch(`${API_BASE_URL}/coupons/${currentCoupon._id}/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || 'Failed to update coupon');
        }
      } else {
        // Add API call
        const res = await fetch(`${API_BASE_URL}/coupons/store`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || 'Failed to add coupon');
        }
      }

      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const filteredCoupons = coupons.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.isActive).length;
  const inactiveCoupons = totalCoupons - activeCoupons;

  return (
    <div className="animate-fade">
      {/* Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-title">Total Coupons</div>
            <div className="stat-value">{totalCoupons}</div>
          </div>
          <div className="stat-icon purple">
            <Ticket size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Active Coupons</div>
            <div className="stat-value">{activeCoupons}</div>
          </div>
          <div className="stat-icon emerald">
            <Percent size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Inactive Coupons</div>
            <div className="stat-value">{inactiveCoupons}</div>
          </div>
          <div className="stat-icon red">
            <Power size={24} />
          </div>
        </div>
      </div>

      {error && (
        <div className="login-error" style={{ marginBottom: '16px', padding: '12px' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Coupons Table Card */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title-container">
            <h2 className="table-title">Coupon Codes</h2>
            <span className="table-subtitle">Create and manage marketing discount coupons for user checkout promotions.</span>
          </div>

          <div className="table-actions">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} size={16} />
              <input
                type="text"
                placeholder="Search coupons..."
                className="search-input"
                style={{ paddingLeft: '34px', width: '220px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={16} />
              <span>Add Coupon</span>
            </button>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading coupons...
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Coupon Code</th>
                  <th>Discount Details</th>
                  <th>Min Order</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>
                      No coupons found.
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((coupon) => (
                    <tr key={coupon._id}>
                      <td>
                        <span style={{ fontWeight: 700, letterSpacing: '0.5px', color: 'var(--accent-primary)', background: 'rgba(255, 85, 0, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                          {coupon.code}
                        </span>
                        {coupon.description && (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {coupon.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>
                          {coupon.discountType === 'percentage' 
                            ? `${coupon.discountValue}% Off` 
                            : `₹${coupon.discountValue} Off`
                          }
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>
                          {coupon.minOrderValue > 0 ? `₹${coupon.minOrderValue}` : 'No Min Order'}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {coupon.expiryDate 
                            ? new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Never Expire'
                          }
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${coupon.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontWeight: 600 }}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button 
                            className={`btn btn-icon-only ${coupon.isActive ? 'btn-secondary' : 'btn-primary'}`} 
                            style={{ padding: '6px' }}
                            onClick={() => handleToggleActive(coupon._id)}
                            title={coupon.isActive ? "Deactivate Coupon" : "Activate Coupon"}
                          >
                            <Power size={14} />
                          </button>
                          <button 
                            className="btn btn-secondary btn-icon-only" 
                            onClick={() => handleOpenEditModal(coupon)}
                            title="Edit Coupon"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon-only" 
                            onClick={() => handleDelete(coupon._id)}
                            title="Delete Coupon"
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

      {/* Coupon Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{currentCoupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
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
                  <label className="form-label" htmlFor="coupon-code">Coupon Code</label>
                  <input
                    id="coupon-code"
                    type="text"
                    className="form-input"
                    placeholder="e.g. WELCOME10"
                    style={{ paddingLeft: '14px', textTransform: 'uppercase' }}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="discount-type">Discount Type</label>
                    <select
                      id="discount-type"
                      className="form-input"
                      style={{ paddingLeft: '10px', height: '42px' }}
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="discount-value">Discount Value</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      {formData.discountType === 'flat' ? (
                        <DollarSign style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} size={16} />
                      ) : (
                        <Percent style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} size={16} />
                      )}
                      <input
                        id="discount-value"
                        type="number"
                        className="form-input"
                        placeholder={formData.discountType === 'percentage' ? 'e.g. 10' : 'e.g. 100'}
                        style={{ paddingLeft: '32px' }}
                        value={formData.discountValue}
                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="min-order">Minimum Order Value (₹)</label>
                  <input
                    id="min-order"
                    type="number"
                    className="form-input"
                    placeholder="e.g. 500 (0 for no limit)"
                    style={{ paddingLeft: '14px' }}
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="expiry-date">Expiry Date</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Calendar style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} size={16} />
                    <input
                      id="expiry-date"
                      type="date"
                      className="form-input"
                      style={{ paddingLeft: '34px' }}
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="coupon-description">Description / Rules</label>
                  <textarea
                    id="coupon-description"
                    className="form-input"
                    placeholder="e.g. Get 10% off up to ₹150 on your first purchase."
                    style={{ paddingLeft: '14px', paddingTop: '10px', height: '80px', resize: 'vertical' }}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentCoupon ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
