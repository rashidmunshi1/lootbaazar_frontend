import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, ShoppingBag, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/frontend';
const API_KEY = process.env.REACT_APP_API_KEY || 'lootbaazarV5kAYC7SJhFGWEnWynVjHW0UU7kA8N9x';

const getImageUrl = (image) => {
  if (!image) return '';
  const url = typeof image === 'object' ? (image.url || '') : (image || '');
  if (typeof url !== 'string') return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('uploads/')) {
    return `http://localhost:3000/${url}`;
  }
  return `http://localhost:3000/uploads/${url}`;
};

export default function ProductsView() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    moq: '',
    category: '',
    userId: '',
    location: '',
    phoneNumber: '',
    paymentStatus: 'pending'
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToastMessage = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formError, setFormError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch categories for dropdown
      const catRes = await fetch(`${API_BASE_URL}/categories`, {
        headers: { 'x-api-key': API_KEY }
      });
      const catData = await catRes.json();
      setCategories(catData);

      // Fetch users for dropdown
      const userRes = await fetch(`${API_BASE_URL}/user/index`, {
        headers: { 'x-api-key': API_KEY }
      });
      const userData = await userRes.json();
      setUsers(userData);

      // Fetch products (fetch all by setting a high limit)
      const prodRes = await fetch(`${API_BASE_URL}/products?limit=1000&all=true`, {
        headers: { 'x-api-key': API_KEY }
      });
      const prodData = await prodRes.json();
      setProducts(prodData.products || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setCurrentProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      stock: '',
      moq: '1',
      category: categories[0]?._id || '',
      userId: users[0]?._id || '',
      location: '',
      phoneNumber: '',
      paymentStatus: 'pending'
    });
    setSelectedFiles([]);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setCurrentProduct(prod);
    
    // Support category being a string ID, populated object, or array
    let selectedCategory = categories[0]?._id || '';
    if (prod.category) {
      if (Array.isArray(prod.category)) {
        const firstCat = prod.category[0];
        selectedCategory = firstCat && typeof firstCat === 'object' ? firstCat._id : firstCat;
      } else if (typeof prod.category === 'object') {
        selectedCategory = prod.category._id;
      } else {
        selectedCategory = prod.category;
      }
    }

    // Support userId being a string ID or populated object
    let selectedUserId = users[0]?._id || '';
    if (prod.userId) {
      selectedUserId = typeof prod.userId === 'object' ? prod.userId._id : prod.userId;
    }

    setFormData({
      title: prod.title || '',
      description: prod.description || '',
      price: prod.price || '',
      stock: prod.stock || '',
      moq: prod.moq || '1',
      category: selectedCategory,
      userId: selectedUserId,
      location: prod.location || '',
      phoneNumber: prod.phoneNumber || '',
      paymentStatus: prod.paymentStatus || 'pending'
    });
    setSelectedFiles([]);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleUpdatePaymentStatus = async (productId, userId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/payment-status`, {
        method: 'PUT',
        headers: {
          'x-api-key': API_KEY,
          'apikey': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          userId,
          paymentStatus: newStatus
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.message || 'Failed to update payment status');
      }
      
      // Update local state list
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, paymentStatus: newStatus } : p));
      showToastMessage(`Payment status updated to "${newStatus.toUpperCase()}"!`, 'success');
    } catch (err) {
      console.error(err);
      showToastMessage(err.message || 'Error updating payment status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}/delete`, {
          method: 'DELETE',
          headers: {
            'x-api-key': API_KEY
          }
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || 'Failed to delete product');
        }
        fetchData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim() || !formData.price || !formData.stock) {
      setFormError('Title, Price, and Stock are required.');
      return;
    }

    if (!formData.category) {
      setFormError('Please select a category.');
      return;
    }

    if (!formData.userId) {
      setFormError('Please select a merchant.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('price', Number(formData.price));
    payload.append('stock', Number(formData.stock));
    payload.append('moq', Number(formData.moq) || 1);
    payload.append('category', formData.category);
    payload.append('userId', formData.userId);
    payload.append('location', formData.location);
    payload.append('phoneNumber', formData.phoneNumber);
    payload.append('paymentStatus', formData.paymentStatus);

    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        payload.append('images', selectedFiles[i]);
      }
    }

    try {
      if (currentProduct) {
        // Edit API call
        const res = await fetch(`${API_BASE_URL}/products/${currentProduct._id}/update`, {
          method: 'PUT',
          headers: {
            'x-api-key': API_KEY
          },
          body: payload
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || 'Failed to update product');
        }
      } else {
        // Add API call
        const res = await fetch(`${API_BASE_URL}/products/store`, {
          method: 'POST',
          headers: {
            'x-api-key': API_KEY
          },
          body: payload
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || 'Failed to create product');
        }
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.title.toLowerCase().includes(search.toLowerCase()) || 
                          (prod.description && prod.description.toLowerCase().includes(search.toLowerCase()));
    
    let matchesCategory = false;
    if (categoryFilter === 'All') {
      matchesCategory = true;
    } else if (Array.isArray(prod.category)) {
      matchesCategory = prod.category.some(cat => {
        if (cat && typeof cat === 'object') {
          return cat._id === categoryFilter;
        }
        return cat === categoryFilter;
      });
    } else if (prod.category && typeof prod.category === 'object') {
      matchesCategory = prod.category._id === categoryFilter;
    } else {
      matchesCategory = prod.category === categoryFilter;
    }

    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryField) => {
    if (!categoryField) return 'Unknown';

    // Handle array case (since backend schema sets category as [{type: ObjectId}])
    if (Array.isArray(categoryField)) {
      if (categoryField.length === 0) return 'Unknown';
      return categoryField.map(cat => {
        if (cat && typeof cat === 'object') {
          return cat.name || 'Unknown';
        }
        const matched = categories.find(c => c._id === cat);
        return matched ? matched.name : 'Unknown';
      }).join(', ');
    }

    // Handle single populated object
    if (typeof categoryField === 'object') {
      return categoryField.name || 'Unknown';
    }

    // Handle single ID string
    const cat = categories.find(c => c._id === categoryField);
    return cat ? cat.name : 'Unknown';
  };

  const getUserName = (idField) => {
    if (!idField) return 'Unknown';

    // Handle populated user object
    if (typeof idField === 'object') {
      return idField.name || idField.mobileno || 'Unknown';
    }

    // Handle ID string
    const u = users.find(userObj => userObj._id === idField);
    return u ? (u.name || u.mobileno) : 'Unknown';
  };

  const totalProducts = products.length;
  const outOfStock = products.filter(p => !p.stock || p.stock <= 0).length;
  // const totalStockVal = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const activeProducts = products.filter(p => p.createdAt && new Date(p.createdAt) > twentyFourHoursAgo).length;
  const expiredProducts = products.filter(p => !p.createdAt || new Date(p.createdAt) <= twentyFourHoursAgo).length;

  return (
    <div className="animate-fade">
      {/* Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-title">Total Products</div>
            <div className="stat-value">{totalProducts}</div>
          </div>
          <div className="stat-icon purple">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Commented out Stock Value as requested */}
        {/* 
        <div className="stat-card">
          <div>
            <div className="stat-title">Stock Value</div>
            <div className="stat-value">₹{totalStockVal.toLocaleString()}</div>
          </div>
          <div className="stat-icon emerald">
            <Sparkles size={24} />
          </div>
        </div>
        */}

        <div className="stat-card">
          <div>
            <div className="stat-title">Active Products</div>
            <div className="stat-value">{activeProducts}</div>
          </div>
          <div className="stat-icon emerald">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Expired Products</div>
            <div className="stat-value">{expiredProducts}</div>
          </div>
          <div className="stat-icon blue">
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Out of Stock</div>
            <div className="stat-value">{outOfStock}</div>
          </div>
          <div className="stat-icon amber">
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      {error && (
        <div className="login-error" style={{ marginBottom: '16px', padding: '12px' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Table Card */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title-container">
            <h2 className="table-title">Product Inventory</h2>
            <span className="table-subtitle">Manage item listings, adjust pricing, check stocks, and review categories.</span>
          </div>

          <div className="table-actions">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} size={16} />
              <input
                type="text"
                placeholder="Search products..."
                className="search-input"
                style={{ paddingLeft: '34px', width: '200px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="search-input"
              style={{ width: '150px', paddingLeft: '10px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading products...
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Price</th>
                  <th>Stock / MOQ</th>
                  <th>Category</th>
                  <th>Merchant</th>
                  <th>Payment</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>
                      No products found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => (
                    <tr key={prod._id}>
                      <td>
                        <div className="avatar-cell">
                          {prod.images && prod.images.length > 0 ? (
                            <img 
                              src={getImageUrl(prod.images[0])}
                              alt={prod.title}
                              className="avatar-img"
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                              onError={(e) => {
                                const fallback = typeof prod.images[0] === 'object' ? prod.images[0].url : prod.images[0];
                                if (typeof fallback === 'string' && !e.target.src.includes('/uploads/uploads/')) {
                                  e.target.src = fallback.startsWith('http') ? fallback : `http://localhost:3000/${fallback}`;
                                }
                              }}
                            />
                          ) : (
                            <div className="avatar-circle" style={{ borderRadius: '4px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                              <ShoppingBag size={16} />
                            </div>
                          )}
                          <div className="avatar-name-info">
                            <span style={{ fontWeight: 600 }}>{prod.title}</span>
                            <span className="avatar-subtext" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {prod.description || 'No description'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>₹{prod.price}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 500 }} className={prod.stock <= 0 ? 'text-danger' : ''}>
                            {prod.stock || 0} in stock
                          </span>
                          <span className="avatar-subtext">Min Order: {prod.moq || 1}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-muted">{getCategoryName(prod.category)}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{getUserName(prod.userId)}</span>
                      </td>
                      <td>
                        <select
                          value={prod.paymentStatus || 'pending'}
                          onChange={(e) => handleUpdatePaymentStatus(prod._id, typeof prod.userId === 'object' ? prod.userId._id : prod.userId, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-secondary)',
                            color: (prod.paymentStatus === 'paid') ? '#10b981' : (prod.paymentStatus === 'pending' ? '#f59e0b' : '#ef4444'),
                            fontWeight: '600',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending" style={{ color: '#f59e0b' }}>Pending</option>
                          <option value="paid" style={{ color: '#10b981' }}>Paid</option>
                          <option value="cancel" style={{ color: '#ef4444' }}>Cancel</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button 
                            className="btn btn-secondary btn-icon-only" 
                            onClick={() => handleOpenEditModal(prod)}
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon-only" 
                            onClick={() => handleDelete(prod._id)}
                            title="Delete Product"
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

      {/* Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{currentProduct ? 'Edit Product Details' : 'Add New Product'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} encType="multipart/form-data">
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {formError && (
                  <div className="login-error" style={{ marginBottom: '8px' }}>
                    <span>{formError}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-title">Product Title</label>
                    <input
                      id="prod-title"
                      type="text"
                      className="form-input"
                      placeholder="e.g. iPhone 15 Pro"
                      style={{ paddingLeft: '14px' }}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-price">Price (₹)</label>
                    <input
                      id="prod-price"
                      type="number"
                      className="form-input"
                      placeholder="e.g. 79999"
                      style={{ paddingLeft: '14px' }}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prod-desc">Description</label>
                  <textarea
                    id="prod-desc"
                    className="form-input"
                    placeholder="Provide description..."
                    style={{ paddingLeft: '14px', height: '80px', resize: 'vertical' }}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-stock">Stock Quantity</label>
                    <input
                      id="prod-stock"
                      type="number"
                      className="form-input"
                      placeholder="e.g. 50"
                      style={{ paddingLeft: '14px' }}
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-moq">Min Order Qty (MOQ)</label>
                    <input
                      id="prod-moq"
                      type="number"
                      className="form-input"
                      placeholder="e.g. 1"
                      style={{ paddingLeft: '14px' }}
                      value={formData.moq}
                      onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-cat">Category</label>
                    <select
                      id="prod-cat"
                      className="form-input"
                      style={{ paddingLeft: '14px', background: 'var(--bg-tertiary)' }}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-user">Merchant / Owner</label>
                    <select
                      id="prod-user"
                      className="form-input"
                      style={{ paddingLeft: '14px', background: 'var(--bg-tertiary)' }}
                      value={formData.userId}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    >
                      <option value="">Select Merchant</option>
                      {users.map(u => (
                        <option key={u._id} value={u._id}>{u.name || u.mobileno}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-loc">Location</label>
                    <input
                      id="prod-loc"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Mumbai, India"
                      style={{ paddingLeft: '14px' }}
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-phone">Contact Number</label>
                    <input
                      id="prod-phone"
                      type="text"
                      className="form-input"
                      placeholder="e.g. +91 9876543210"
                      style={{ paddingLeft: '14px' }}
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-payment-status">Listing Payment Status</label>
                    <select
                      id="prod-payment-status"
                      className="form-input"
                      style={{ paddingLeft: '14px', background: 'var(--bg-tertiary)' }}
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="cancel">Cancel</option>
                    </select>
                  </div>
                  <div className="form-group"></div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prod-images">Product Images (Up to 5)</label>
                  <input
                    id="prod-images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="form-input"
                    style={{ padding: '8px 14px' }}
                    onChange={handleFileChange}
                  />
                  {currentProduct && currentProduct.images && currentProduct.images.length > 0 && (
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      {currentProduct.images.map((img, i) => (
                        <img 
                          key={i}
                          src={getImageUrl(img)} 
                          alt="" 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                          onError={(e) => {
                            const fallback = typeof img === 'object' ? img.url : img;
                            if (typeof fallback === 'string' && !e.target.src.includes('/uploads/uploads/')) {
                              e.target.src = fallback.startsWith('http') ? fallback : `http://localhost:3000/${fallback}`;
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'var(--bg-secondary)',
          borderLeft: `4px solid ${toast.type === 'success' ? '#10b981' : '#ef4444'}`,
          boxShadow: 'var(--shadow-lg)',
          borderRadius: '8px',
          padding: '16px 24px',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'toastSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid var(--border-color)',
          borderLeftWidth: '4px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444'
          }} />
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {toast.message}
          </span>
          <button 
            onClick={() => setToast({ show: false, message: '', type: 'success' })}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              marginLeft: '8px',
              padding: '2px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <style>{`
        @keyframes toastSlideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
