import React, { useState, useEffect } from 'react';
import { Users, Tag, ShoppingBag } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/frontend';
const API_KEY = process.env.REACT_APP_API_KEY || 'lootbaazarV5kAYC7SJhFGWEnWynVjHW0UU7kA8N9x';

const getRequestHeaders = () => {
  return {
    'x-api-key': API_KEY,
    'apikey': API_KEY
  };
};

export default function DashboardView() {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    products: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Users
        const userRes = await fetch(`${API_BASE_URL}/user/index`, {
          headers: getRequestHeaders()
        });
        let totalUsers = 0;
        if (userRes.ok) {
          const userData = await userRes.json();
          totalUsers = Array.isArray(userData) ? userData.length : 0;
        }

        // 2. Fetch Categories
        const catRes = await fetch(`${API_BASE_URL}/categories`, {
          headers: getRequestHeaders()
        });
        let totalCategories = 0;
        if (catRes.ok) {
          const catData = await catRes.json();
          totalCategories = Array.isArray(catData) ? catData.length : 0;
        }

        // 3. Fetch Products
        const prodRes = await fetch(`${API_BASE_URL}/products?limit=1&all=true`, {
          headers: getRequestHeaders()
        });
        let totalProducts = 0;
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          totalProducts = prodData.totalProducts !== undefined 
            ? prodData.totalProducts 
            : (Array.isArray(prodData.products) ? prodData.products.length : 0);
        }

        setStats({
          users: totalUsers,
          categories: totalCategories,
          products: totalProducts
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="animate-fade">
      {error && (
        <div className="login-error" style={{ marginBottom: '16px', padding: '12px' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Overview Statistics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value">
              {loading ? (
                <span className="animate-pulse" style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Loading...</span>
              ) : (
                stats.users
              )}
            </div>
          </div>
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Total Categories</div>
            <div className="stat-value">
              {loading ? (
                <span className="animate-pulse" style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Loading...</span>
              ) : (
                stats.categories
              )}
            </div>
          </div>
          <div className="stat-icon emerald">
            <Tag size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Total Products</div>
            <div className="stat-value">
              {loading ? (
                <span className="animate-pulse" style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Loading...</span>
              ) : (
                stats.products
              )}
            </div>
          </div>
          <div className="stat-icon purple">
            <ShoppingBag size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}