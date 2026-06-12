import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Shield, UserCheck, UserX, X, AlertCircle } from 'lucide-react';

const INITIAL_USERS = [
  { id: 1, name: 'Rashid Munshi', email: 'rashid@lootbaazar.com', role: 'Super Admin', status: 'Active', joined: '2026-01-15' },
  { id: 2, name: 'Jane Doe', email: 'jane@gmail.com', role: 'Moderator', status: 'Active', joined: '2026-03-22' },
  { id: 3, name: 'John Smith', email: 'john.smith@yahoo.com', role: 'Customer', status: 'Active', joined: '2026-04-05' },
  { id: 4, name: 'Robert Johnson', email: 'robert@outlook.com', role: 'Business Owner', status: 'Suspended', joined: '2026-02-18' },
  { id: 5, name: 'Emily Davis', email: 'emily.d@gmail.com', role: 'Customer', status: 'Active', joined: '2026-05-12' },
];

export default function UsersView() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // null for add, object for edit

  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Customer', status: 'Active' });
  const [formError, setFormError] = useState('');

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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Name and email are required.');
      return;
    }

    if (currentUser) {
      // Edit mode
      setUsers(users.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, ...formData };
        }
        return u;
      }));
    } else {
      // Add mode
      const newUser = {
        id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...formData,
        joined: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }

    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const suspendedUsers = users.filter(u => u.status === 'Suspended').length;

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
              <Search style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} size={16} />
              <input
                type="text"
                placeholder="Search name, email..."
                className="search-input"
                style={{ paddingLeft: '34px', width: '200px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="search-input"
              style={{ width: '130px', paddingLeft: '10px' }}
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
                  <td colSpan="5" style={{ textCombineUpright: 'center', padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No users found matching filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="avatar-cell">
                        <div className="avatar-circle">
                          {user.name.split(' ').map(n => n[0]).join('')}
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
                        onClick={() => handleToggleStatus(user.id)}
                        className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-danger'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle status"
                      >
                        {user.status}
                      </button>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{user.joined}</td>
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
                          onClick={() => handleDelete(user.id)}
                          title="Delete User"
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
                    style={{ paddingLeft: '14px', background: 'var(--bg-tertiary)' }}
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
                    style={{ paddingLeft: '14px', background: 'var(--bg-tertiary)' }}
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
