import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Calendar, Link as LinkIcon, Check, X } from 'lucide-react';

const INITIAL_BANNERS = [
  { 
    id: 1, 
    title: 'Summer Loot Festival', 
    desc: 'Get up to 50% discount on summer essentials, fashion wear, and sports gear.', 
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
    link: '/promotions/summer-loot',
    status: 'Active',
    position: 'Main Carousel',
    schedule: '2026-06-01 to 2026-07-31'
  },
  { 
    id: 2, 
    title: 'Electronics Blowout Sale', 
    desc: 'Unbeatable deals on smartphones, accessories, smart TVs and laptops.', 
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    link: '/deals/electronics',
    status: 'Active',
    position: 'Mid Banner 1',
    schedule: '2026-06-10 to 2026-06-25'
  },
  { 
    id: 3, 
    title: 'New Season Fashion Arrivals', 
    desc: 'Explore boutique apparel styles, shoes, and fresh apparel selections.', 
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&auto=format&fit=crop&q=80',
    link: '/collections/new-fashion',
    status: 'Scheduled',
    position: 'Main Carousel',
    schedule: '2026-08-01 to 2026-08-31'
  },
];

export default function BannersView() {
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ title: '', desc: '', image: '', link: '', status: 'Active', position: 'Main Carousel', schedule: '' });
  const [formError, setFormError] = useState('');

  const handleOpenAddModal = () => {
    setCurrentBanner(null);
    setFormData({ title: '', desc: '', image: '', link: '', status: 'Active', position: 'Main Carousel', schedule: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (banner) => {
    setCurrentBanner(banner);
    setFormData({ 
      title: banner.title, 
      desc: banner.desc, 
      image: banner.image, 
      link: banner.link, 
      status: banner.status, 
      position: banner.position,
      schedule: banner.schedule 
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setBanners(banners.map(b => {
      if (b.id === id) {
        return { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return b;
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim() || !formData.schedule.trim()) {
      setFormError('Banner title and campaign schedule dates are required.');
      return;
    }

    const placeholderImg = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80';
    const finalImg = formData.image.trim() || placeholderImg;

    if (currentBanner) {
      // Edit
      setBanners(banners.map(b => {
        if (b.id === currentBanner.id) {
          return { ...b, ...formData, image: finalImg };
        }
        return b;
      }));
    } else {
      // Add
      const newBanner = {
        id: banners.length ? Math.max(...banners.map(b => b.id)) + 1 : 1,
        ...formData,
        image: finalImg
      };
      setBanners([...banners, newBanner]);
    }

    setIsModalOpen(false);
  };

  const filteredBanners = banners.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.desc.toLowerCase().includes(search.toLowerCase()) ||
    b.position.toLowerCase().includes(search.toLowerCase())
  );

  const totalBanners = banners.length;
  const activeBanners = banners.filter(b => b.status === 'Active').length;
  const scheduledBanners = banners.filter(b => b.status === 'Scheduled').length;

  return (
    <div className="animate-fade">
      {/* Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-title">Total Campaigns</div>
            <div className="stat-value">{totalBanners}</div>
          </div>
          <div className="stat-icon purple">
            <ImageIcon size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Active Banners</div>
            <div className="stat-value">{activeBanners}</div>
          </div>
          <div className="stat-icon emerald">
            <Check size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Scheduled Campaigns</div>
            <div className="stat-value">{scheduledBanners}</div>
          </div>
          <div className="stat-icon blue">
            <Calendar size={24} />
          </div>
        </div>
      </div>

      {/* Grid Header Actions */}
      <div className="table-card" style={{ marginBottom: '24px', borderBottom: 'none' }}>
        <div className="table-header">
          <div className="table-title-container">
            <h2 className="table-title">Banner Campaigns</h2>
            <span className="table-subtitle">Launch store promotions, manage display placements, and scheduling.</span>
          </div>

          <div className="table-actions">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} size={16} />
              <input
                type="text"
                placeholder="Search banners, spots..."
                className="search-input"
                style={{ paddingLeft: '34px', width: '220px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={16} />
              <span>Add Banner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Cards Container */}
      {filteredBanners.length === 0 ? (
        <div className="table-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No banners found matching search.
        </div>
      ) : (
        <div className="grid-layout">
          {filteredBanners.map((banner) => (
            <div className="grid-card" key={banner.id}>
              <div className="grid-card-media">
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="grid-card-img"
                />
                <button
                  onClick={() => handleToggleStatus(banner.id)}
                  className={`badge grid-card-badge ${
                    banner.status === 'Active' ? 'badge-success' :
                    banner.status === 'Scheduled' ? 'badge-info' : 'badge-danger'
                  }`}
                  style={{ cursor: 'pointer', border: 'none' }}
                  title="Click to toggle status"
                >
                  {banner.status}
                </button>
              </div>

              <div className="grid-card-body">
                <span className="badge badge-muted" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
                  {banner.position}
                </span>
                
                <h3 className="grid-card-title">{banner.title}</h3>
                
                <p className="grid-card-desc">{banner.desc}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} className="text-gradient" />
                    <span>{banner.schedule}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                    <LinkIcon size={14} />
                    <span>{banner.link}</span>
                  </div>
                </div>

                <div className="grid-card-meta">
                  <span>Banner ID: #{banner.id}</span>
                  <div className="grid-card-actions">
                    <button 
                      className="btn btn-secondary btn-icon-only" 
                      onClick={() => handleOpenEditModal(banner)}
                      title="Edit Banner"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      className="btn btn-danger btn-icon-only" 
                      onClick={() => handleDelete(banner.id)}
                      title="Delete Banner"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banner Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{currentBanner ? 'Edit Banner Campaign' : 'Create Banner Campaign'}</h3>
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
                  <label className="form-label" htmlFor="banner-title">Campaign Title</label>
                  <input
                    id="banner-title"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Winter Sale Bonanza"
                    style={{ paddingLeft: '14px' }}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="banner-desc">Description</label>
                  <textarea
                    id="banner-desc"
                    className="form-input"
                    placeholder="Marketing teaser text..."
                    style={{ paddingLeft: '14px', height: '70px', resize: 'vertical' }}
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="banner-image">Banner Image URL</label>
                  <input
                    id="banner-image"
                    type="text"
                    className="form-input"
                    placeholder="https://unsplash.com/photos..."
                    style={{ paddingLeft: '14px' }}
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="banner-link">Target Redirection URL</label>
                  <input
                    id="banner-link"
                    type="text"
                    className="form-input"
                    placeholder="e.g. /deals/winter-sale"
                    style={{ paddingLeft: '14px' }}
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="banner-sched">Schedule Dates (YYYY-MM-DD to YYYY-MM-DD)</label>
                  <input
                    id="banner-sched"
                    type="text"
                    className="form-input"
                    placeholder="e.g. 2026-11-01 to 2026-12-31"
                    style={{ paddingLeft: '14px' }}
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="banner-pos">Slot Position</label>
                    <select
                      id="banner-pos"
                      className="form-input"
                      style={{ paddingLeft: '14px', background: 'var(--bg-tertiary)' }}
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    >
                      <option value="Main Carousel">Main Carousel</option>
                      <option value="Mid Banner 1">Mid Banner 1</option>
                      <option value="Mid Banner 2">Mid Banner 2</option>
                      <option value="Sidebar Spot">Sidebar Spot</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="banner-status">Initial Status</label>
                    <select
                      id="banner-status"
                      className="form-input"
                      style={{ paddingLeft: '14px', background: 'var(--bg-tertiary)' }}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentBanner ? 'Save Changes' : 'Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
