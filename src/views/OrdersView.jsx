import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Receipt, Calendar, User, ShoppingBag, Eye, CreditCard, RefreshCw, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/frontend';
const API_KEY = process.env.REACT_APP_API_KEY || 'lootbaazarV5kAYC7SJhFGWEnWynVjHW0UU7kA8N9x';

const getRequestHeaders = () => {
  return {
    'x-api-key': API_KEY,
    'apikey': API_KEY
  };
};

export default function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hover states for dynamic visual interaction
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: getRequestHeaders()
      });
      if (!res.ok) throw new Error('Failed to retrieve orders list');
      const result = await res.json();
      if (result.success) {
        setOrders(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch orders');
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not synchronize orders list from backend registry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          ...getRequestHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentStatus: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update order status');
      const result = await res.json();
      if (result.success) {
        // Update local state list
        setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, paymentStatus: newStatus } : o));
        // Update currently viewed order in modal
        setSelectedOrder(prev => ({ ...prev, paymentStatus: newStatus }));
      } else {
        throw new Error(result.error || 'Failed to update order status');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error updating payment status');
    }
  };

  // Modern Glassmorphic Badge Styles
  const getStatusBadgeStyle = (status) => {
    if (!status) return {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: 'rgba(113, 128, 150, 0.1)',
      border: '1px solid rgba(113, 128, 150, 0.2)',
      color: 'var(--text-secondary)'
    };
    
    const s = status.toLowerCase();
    if (s === 'paid') {
      return {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        color: '#10b981'
      };
    }
    if (s === 'pending') {
      return {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        color: '#f59e0b'
      };
    }
    return {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      color: '#ef4444'
    };
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();
    const orderId = order.orderId ? order.orderId.toLowerCase() : '';
    const status = order.paymentStatus ? order.paymentStatus.toLowerCase() : '';
    const txnId = order.transactionId ? order.transactionId.toLowerCase() : '';
    const userName = order.userId && order.userId.name ? order.userId.name.toLowerCase() : '';
    const userPhone = order.userId && order.userId.mobileno ? order.userId.mobileno.toLowerCase() : '';
    const productName = order.productId && order.productId.title ? order.productId.title.toLowerCase() : '';

    return (
      orderId.includes(query) ||
      status.includes(query) ||
      txnId.includes(query) ||
      userName.includes(query) ||
      userPhone.includes(query) ||
      productName.includes(query)
    );
  });

  // Calculate high-fidelity metrics
  const totalCount = orders.length;
  const paidOrders = orders.filter(o => o.paymentStatus && o.paymentStatus.toLowerCase() === 'paid');
  const paidCount = paidOrders.length;
  const pendingCount = orders.filter(o => o.paymentStatus && o.paymentStatus.toLowerCase() === 'pending').length;
  
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.productId?.price || 0), 0);

  // Generate User Initials for Avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out', padding: '4px 0' }}>
      
      {/* View Header with Gradient Banner style */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
        padding: '24px 30px',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #ff7733 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 8px 16px rgba(255, 85, 0, 0.2)'
          }}>
            <Receipt size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>
              Orders Directory
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Monitor transactions status, client invoices, and payment receipts.
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => fetchOrders(true)} 
          disabled={refreshing || loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: 'var(--shadow-sm)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Logs'}</span>
        </button>
      </div>

      {/* Modern Dashboard Metrics Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {/* Metric 1: Total Orders */}
        <div 
          style={{
            background: 'var(--bg-secondary)',
            padding: '20px 24px',
            borderRadius: '16px',
            boxShadow: hoveredCard === 1 ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            border: hoveredCard === 1 ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'default',
            transform: hoveredCard === 1 ? 'translateY(-3px)' : 'translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px' }}>
              {loading ? '...' : totalCount}
            </div>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            color: 'var(--accent-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Receipt size={24} />
          </div>
        </div>

        {/* Metric 2: Total Revenue */}
        <div 
          style={{
            background: 'var(--bg-secondary)',
            padding: '20px 24px',
            borderRadius: '16px',
            boxShadow: hoveredCard === 2 ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            border: hoveredCard === 2 ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'default',
            transform: hoveredCard === 2 ? 'translateY(-3px)' : 'translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Volume (Paid)</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#10b981', marginTop: '8px' }}>
              {loading ? '...' : `₹${totalRevenue.toLocaleString()}`}
            </div>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Metric 3: Paid Orders */}
        <div 
          style={{
            background: 'var(--bg-secondary)',
            padding: '20px 24px',
            borderRadius: '16px',
            boxShadow: hoveredCard === 3 ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            border: hoveredCard === 3 ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'default',
            transform: hoveredCard === 3 ? 'translateY(-3px)' : 'translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={() => setHoveredCard(3)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Paid Orders</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px' }}>
              {loading ? '...' : paidCount}
            </div>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle size={24} />
          </div>
        </div>

        {/* Metric 4: Pending Orders */}
        <div 
          style={{
            background: 'var(--bg-secondary)',
            padding: '20px 24px',
            borderRadius: '16px',
            boxShadow: hoveredCard === 4 ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            border: hoveredCard === 4 ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'default',
            transform: hoveredCard === 4 ? 'translateY(-3px)' : 'translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={() => setHoveredCard(4)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Payments</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px' }}>
              {loading ? '...' : pendingCount}
            </div>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Premium Search and Control Panel */}
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          maxWidth: '480px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          transition: 'all 0.3s ease'
        }}>
          <Search style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} size={18} />
          <input
            type="text"
            placeholder="Search by Order ID, Client, Product, Status or Txn ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 40px 12px 44px',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                borderRadius: '50%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {error && (
        <div className="login-error" style={{ marginBottom: '16px', padding: '12px' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Main Data Table Card */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 0',
              gap: '16px'
            }}>
              <div className="animate-spin" style={{
                width: '32px',
                height: '32px',
                border: '3px solid var(--border-color)',
                borderTopColor: 'var(--accent-primary)',
                borderRadius: '50%'
              }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Fetching Order Records...</span>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-tertiary)'
                }}>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Order ID</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Client / Buyer</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Product details</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Timestamp</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Transaction ID</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      No matching order logs found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, idx) => (
                    <tr 
                      key={order._id || idx}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: hoveredRow === idx ? 'var(--bg-tertiary)' : 'transparent',
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={() => setHoveredRow(idx)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => handleOpenDetails(order)}
                    >
                      {/* Order ID */}
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--accent-primary)', fontSize: '14px' }}>
                        {order.orderId}
                      </td>

                      {/* Client details with custom avatar */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 85, 0, 0.1)',
                            color: 'var(--accent-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '12px'
                          }}>
                            {getInitials(order.userId?.name)}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>
                              {order.userId?.name || 'Unknown Buyer'}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {order.userId?.mobileno || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Product details */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '14px' }}>
                            {order.productId?.title || 'Unknown Product'}
                          </span>
                          <span style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: '700', marginTop: '2px' }}>
                            ₹{(order.productId?.price || 0).toLocaleString()}
                          </span>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-primary)' }}>
                          <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                          <span>{new Date(order.dateTime).toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={getStatusBadgeStyle(order.paymentStatus)}>
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Transaction ID */}
                      <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-primary)' }}>
                        {order.transactionId || (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>N/A</span>
                        )}
                      </td>

                      {/* Eye Action button */}
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // prevent row click trigger
                            handleOpenDetails(order);
                          }}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--accent-info)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                            e.currentTarget.style.borderColor = 'var(--accent-info)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* High-Fidelity Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            className="modal-content" 
            style={{ 
              maxWidth: '560px', 
              width: '90%', 
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              animation: 'scaleIn 0.3s ease-out'
            }}
          >
            {/* Modal Header with status background color */}
            <div style={{
              background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 85, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)'
                }}>
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>Order Summary</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {selectedOrder.orderId}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)' }}>
              
              {/* Payment status banner & modifier */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                marginBottom: '20px',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Invoice status</span>
                  <span style={getStatusBadgeStyle(selectedOrder.paymentStatus)}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="change-status-select" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Update status:</label>
                  <select
                    id="change-status-select"
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => handleUpdateStatus(selectedOrder.orderId, e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '600',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancel">Cancel</option>
                  </select>
                </div>
              </div>

              {/* Client Card */}
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  <User size={15} style={{ color: 'var(--accent-primary)' }} />
                  <span>Client Information</span>
                </h4>
                <div style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Name</span>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>{selectedOrder.userId?.name || 'Deleted Account'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Mobile</span>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>{selectedOrder.userId?.mobileno || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Product Card */}
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  <ShoppingBag size={15} style={{ color: 'var(--accent-primary)' }} />
                  <span>Product details</span>
                </h4>
                <div style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Product Name</span>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>{selectedOrder.productId?.title || 'Deleted Product'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Billing Amount</span>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--accent-primary)', marginTop: '2px' }}>₹{(selectedOrder.productId?.price || 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Transaction details card */}
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  <CreditCard size={15} style={{ color: 'var(--accent-primary)' }} />
                  <span>Transaction Audit Trail</span>
                </h4>
                <div style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gateway Reference</span>
                    <div style={{ fontSize: '13px', fontWeight: '600', fontFamily: 'monospace', color: 'var(--text-primary)', marginTop: '2px' }}>
                      {selectedOrder.transactionId || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Created Date & Time</span>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>
                      {new Date(selectedOrder.dateTime).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              backgroundColor: 'var(--bg-tertiary)',
              padding: '16px 24px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary"
                style={{ padding: '8px 18px', fontSize: '14px', borderRadius: '8px' }}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
