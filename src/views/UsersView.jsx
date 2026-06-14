import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Shield, UserCheck, UserX, X, AlertCircle, Loader2 } from 'lucide-react';

// Explicitly pointing to your updated port 3001
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/frontend';
const API_KEY = process.env.REACT_APP_API_KEY || 'lootbaazarV5kAYC7SJhFGWEnWynVjHW0UU7kA8N9x';

// Dual-header configuration to safely bypass his live middleware validation check
const getRequestHeaders = (contentType = false) => {
  const headers = {
    'x-api-key': API_KEY,
    'apikey': API_KEY
  };
  if (contentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export default function UsersView({ globalSearch = '' }) {
  const [users, setUsers] = useState([]);
  const [localSearch, setLocalSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Customer', status: 'Active' });
  const [formError, setFormError] = useState('');

  const activeSearchQuery = globalSearch || localSearch;

  // FETCH USERS - Connected directly to Rashid's live '/user/index' endpoint
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/user/index`, {
        headers: getRequestHeaders()
      });
      if (!res.ok) throw new Error('Failed to retrieve system user accounts');
      const data = await res.json();
      setUsers(data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not synchronize user directory data from backend registry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenAddModal = () => {
    setCurrentUser(null);
    setFormData({ name: '', email: '', role: 'Customer', status: 'Active' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setCurrentUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    setFormError('');
    setIsModalOpen(true);
  };

  // DELETE USER - Connected directly to Rashid's live '/profile/:id/delete' endpoint
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this user account?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/profile/${id}/delete`, {
          method: 'DELETE',
          headers: getRequestHeaders()
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || 'Failed to drop user record');
        }
        fetchUsers();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // TOGGLE STATUS - Connected directly to Rashid's live '/profile/:id/update' endpoint
  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    const userId = user._id || user.id;

    const payload = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: nextStatus
    };

    try {
      const res = await fetch(`${API_BASE_URL}/profile/${userId}/update`, {
        method: 'PUT',
        headers: getRequestHeaders(true),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to modify status permission flags.');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  // SAVE / REGISTER - Connected directly to Rashid's live '/register' and '/profile/:id/update' endpoints
  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Name and email parameters are mandatory.');
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status
    };

    try {
      if (currentUser) {
        // Edit Mode via '/profile/:id/update'
        const userId = currentUser._id || currentUser.id;
        const res = await fetch(`${API_BASE_URL}/profile/${userId}/update`, {
          method: 'PUT',
          headers: getRequestHeaders(true),
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || 'Failed to update user config.');
        }
      } else {
        // Register Mode via '/register'
        const res = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: getRequestHeaders(true),
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || 'Failed to register account schema.');
        }
      }

      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.name?.toLowerCase() || '').includes(activeSearchQuery.toLowerCase()) ||
                          (u.email?.toLowerCase() || '').includes(activeSearchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const suspendedUsers = users.filter(u => u.status === 'Suspended').length;

  if (loading && users.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent-primary)', marginBottom: '12px' }} />
        <span>Syncing system user directories...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value">{totalUsers}</div>
          </div>
          <div className="stat-icon blue">
            <Shield size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Active Accounts</div>
            <div className="stat-value">{activeUsers}</div>
          </div>
          <div className="stat-icon emerald">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Suspended Accounts</div>
            <div className="stat-value">{suspendedUsers}</div>
          </div>
          <div className="stat-icon amber">
            <UserX size={24} />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title-container">
            <h2 className="table-title">Registered Users</h2>
            <span className="table-subtitle">Manage system user profiles, status, and permissions.</span>
          </div>

          <div className="table-actions">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} size={16} />
              <input
                type="text"
                placeholder="Search name, email..."
                className="search-input"
                style={{ paddingLeft: '38px', width: '220px' }}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>

            <select
              className="search-input"
              style={{ width: '140px', paddingLeft: '12px', paddingRight: '12px' }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Moderator">Moderator</option>
              <option value="Business Owner">Business Owner</option>
              <option value="Customer">Customer</option>
            </select>

            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={16} />
              <span>Add User</span>
            </button>
          </div>
        </div>

        <div className="table-container">
          {error && <div style={{ color: 'var(--accent-danger)', padding: '12px 24px' }}>⚠️ {error}</div>}
          <table className="custom-table">
            <thead>
              <tr>
                <th>User Profile</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No registered user accounts found matching query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const userId = user._id || user.id;
                  return (
                    <tr key={userId}>
                      <td>
                        <div className="avatar-cell">
                          <div className="avatar-circle">
                            {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                          </div>
                          <div className="avatar-name-info">
                            <span style={{ fontWeight: 600 }}>{user.name}</span>
                            <span className="avatar-subtext">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          user.role === 'Super Admin' ? 'badge-danger' :
                          user.role === 'Moderator' ? 'badge-warning' :
                          user.role === 'Business Owner' ? 'badge-info' : 'badge-muted'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleToggleStatus(user)}
                          className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-danger'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                          title="Click to toggle status"
                        >
                          {user.status}
                        </button>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {user.joined ? user.joined.split('T')[0] : 'N/A'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button 
                            className="btn btn-secondary btn-icon-only" 
                            onClick={() => handleOpenEditModal(user)}
                            title="Edit User"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon-only" 
                            onClick={() => handleDelete(userId)}
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{currentUser ? 'Edit User Profile' : 'Add New User'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {formError && (
                  <div className="login-error" style={{ marginBottom: '8px' }}>
                    <AlertCircle size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="user-name">Full Name</label>
                  <input
                    id="user-name"
                    type="text"
                    className="form-input"
                    placeholder="Enter full name"
                    style={{ paddingLeft: '14px' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="user-email">Email Address</label>
                  <input
                    id="user-email"
                    type="email"
                    className="form-input"
                    placeholder="name@example.com"
                    style={{ paddingLeft: '14px' }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="user-role">Account Role</label>
                  <select
                    id="user-role"
                    className="form-input"
                    style={{ paddingLeft: '14px' }}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="user-status">Account Status</label>
                  <select
                    id="user-status"
                    className="form-input"
                    style={{ paddingLeft: '14px' }}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
//end of the this file 