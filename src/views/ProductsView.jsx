import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, ShoppingBag, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';

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
    phoneNumber: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formError, setFormError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const catRes = await fetch(`${API_BASE_URL}/categories`, {
        headers: { 'x-api-key': API_KEY }
      });
      const catData = await catRes.json();
      setCategories(catData);

      const userRes = await fetch(`${API_BASE_URL}/user/index`, {
        headers: { 'x-api-key': API_KEY }
      });
      const userData = await userRes.json();
      setUsers(userData);

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
      phoneNumber: ''
    });
    setSelectedFiles([]);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setCurrentProduct(prod);
    setFormData({
      title: prod.title || '',
      description: prod.description || '',
      price: prod.price || '',
      stock: prod.stock || '',
      moq: prod.moq || '1',
      category: prod.categoryId || prod.category || categories[0]?._id || '',
      userId: prod.userId || users[0]?._id || '',
      location: prod.location || '',
      phoneNumber: prod.phoneNumber || ''
    });
    setSelectedFiles([]);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}/delete`, {
          method: 'DELETE',
          headers: { 'x-api-key': API_KEY }
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
    payload.append('category', formData.category); // Maps backend storage requirements
    payload.append('userId', formData.userId);
    payload.append('location', formData.location);
    payload.append('phoneNumber', formData.phoneNumber);

    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        payload.append('images', selectedFiles[i]);
      }
    }

    try {
      if (currentProduct) {
        const res = await fetch(`${API_BASE_URL}/products/${currentProduct._id}/update`, {
          method: 'PUT',
          headers: { 'x-api-key': API_KEY },
          body: payload
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || 'Failed to update product');
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/products/store`, {
          method: 'POST',
          headers: { 'x-api-key': API_KEY },
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

  // Fixed filtering criteria supporting alternate indexing patterns
  const filteredProducts = products.filter(prod => {
    const titleText = prod.title || '';
    const descText = prod.description || '';
    const prodCat = prod.categoryId || prod.category || '';
    
    const matchesSearch = titleText.toLowerCase().includes(search.toLowerCase()) || 
                          descText.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || prodCat === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // const getCategoryName = (id) => {
  //   if (!id) return 'Unknown';
  //   const cat = categories.find(c => c._id === id);
  //   return cat ? cat.name : 'Unknown';
  // };
    const getCategoryName = (categoryArray) => {
  // If the field doesn't exist or is an empty array, exit early
  if (!categoryArray || !Array.isArray(categoryArray) || categoryArray.length === 0) {
    return 'Unknown';
  }
  
  // 1. Grab the first element inside the backend array
  const targetCategory = categoryArray[0];

  // 2. Fallback check if the backend ever populates it as an object
  if (typeof targetCategory === 'object' && targetCategory.name) {
    return targetCategory.name;
  }

  // 3. Otherwise, look up the raw ID string in your local state
  const idString = typeof targetCategory === 'object' ? targetCategory._id : targetCategory;
  if (!idString) return 'Unknown';

  const cat = categories.find(c => c._id === idString);
  return cat ? cat.name : 'Unknown';
};


  const getUserName = (id) => {
    const u = users.find(userObj => userObj._id === id);
    return u ? (u.name || u.mobileno) : 'Unknown';
  };

  const totalProducts = products.length;
  const outOfStock = products.filter(p => !p.stock || p.stock <= 0).length;

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const activeProducts = products.filter(p => p.createdAt && new Date(p.createdAt) > twentyFourHoursAgo).length;
  const expiredProducts = products.filter(p => !p.createdAt || new Date(p.createdAt) <= twentyFourHoursAgo).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  if (loading && products.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px', color: 'var(--text-secondary)' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent-primary)', marginBottom: '12px' }} />
        <span style={{ fontWeight: 500 }}>Syncing system product catalog database...</span>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-fade">
      {/* Metrics Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="stats-grid">
        <motion.div variants={itemVariants} className="stat-card">
          <div>
            <div className="stat-title">Total Products</div>
            <div className="stat-value">{totalProducts}</div>
          </div>
          <div className="stat-icon purple"><ShoppingBag size={24} /></div>
        </motion.div>

        <motion.div variants={itemVariants} className="stat-card">
          <div>
            <div className="stat-title">Active Products</div>
            <div className="stat-value">{activeProducts}</div>
          </div>
          <div className="stat-icon emerald"><CheckCircle size={24} /></div>
        </motion.div>

        <motion.div variants={itemVariants} className="stat-card">
          <div>
            <div className="stat-title">Expired Products</div>
            <div className="stat-value">{expiredProducts}</div>
          </div>
          <div className="stat-icon blue"><Clock size={24} /></div>
        </motion.div>

        <motion.div variants={itemVariants} className="stat-card">
          <div>
            <div className="stat-title">Out of Stock</div>
            <div className="stat-value">{outOfStock}</div>
          </div>
          <div className="stat-icon amber"><AlertCircle size={24} /></div>
        </motion.div>
      </motion.div>

      {error && (
        <div className="login-error" style={{ marginBottom: '16px', padding: '12px' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Main Table Layer */}
      <div className="table-card" style={{ marginTop: '24px' }}>
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
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Price</th>
                <th>Stock / MOQ</th>
                <th>Category</th>
                <th>Merchant</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <motion.tbody layout>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <motion.tr key={prod._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <td>
                      <div className="avatar-cell">
                        {prod.images && prod.images.length > 0 ? (
                          <img 
                            src={getImageUrl(prod.images[0])}
                            alt={prod.title || 'Product Image'}
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
                          <span style={{ fontWeight: 600 }}>{prod.title || 'No Title'}</span>
                          <span className="avatar-subtext" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {prod.description || 'No description'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 600 }}>{prod.price ? `₹${prod.price}` : '₹0'}</span></td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500 }} className={prod.stock <= 0 ? 'text-danger' : ''}>
                          {prod.stock || 0} in stock
                        </span>
                        <span className="avatar-subtext">Min Order: {prod.moq || 1}</span>
                      </div>
                    </td>
                    <td>
                      {/* Fixed: Maps dynamically over fallback database keys */}
                      <span className="badge badge-muted">
                        {getCategoryName(prod.categoryId || prod.category)}
                      </span>
                    </td>
                    <td><span style={{ fontSize: '13px', fontWeight: 500 }}>{getUserName(prod.userId)}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button className="btn btn-secondary btn-icon-only" onClick={() => handleOpenEditModal(prod)} title="Edit Product">
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-danger btn-icon-only" onClick={() => handleDelete(prod._id)} title="Delete Product">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </div>

      {/* Elastic Form Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="modal-content" 
              style={{ maxWidth: '600px', width: '100%' }}
            >
              <div className="modal-header">
                <h3 className="modal-title">{currentProduct ? 'Edit Product Details' : 'Add New Product'}</h3>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} encType="multipart/form-data">
                <div className="modal-body" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
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
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{currentProduct ? 'Save Changes' : 'Create Product'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}