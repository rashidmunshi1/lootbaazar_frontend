import React from 'react';
import { TrendingUp, ShoppingBag, Globe } from 'lucide-react';

export default function DashboardView() {
  return (
    <div className="animate-fade">
      {/* Overview Statistics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-title">Platform Gross Volume</div>
            <div className="stat-value">₹14,84,200</div>
          </div>
          <div className="stat-icon blue">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Active Orders Today</div>
            <div className="stat-value">342</div>
          </div>
          <div className="stat-icon emerald">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-title">Total Active Listings</div>
            <div className="stat-value">1,829</div>
          </div>
          <div className="stat-icon purple">
            <Globe size={24} />
          </div>
        </div>
      </div>

      {/* Performance Analytics Table Block */}
      <div className="table-card" style={{ padding: '24px' }}>
        <h3 className="table-title">Recent Transactions & Activity Log</h3>
        <p className="table-subtitle" style={{ marginBottom: '20px' }}>Real-time overview of platform sales and merchant activations across regions.</p>
        
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Store Partner</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>#LB-9021</b></td>
                <td>Zayed Electronics Outlet</td>
                <td>Gadgets & Appliances</td>
                <td>₹24,500</td>
                <td><span className="badge badge-success">Completed</span></td>
              </tr>
              <tr>
                <td><b>#LB-9022</b></td>
                <td>Al-Noor Fashion Hub</td>
                <td>Clothing & Apparel</td>
                <td>₹4,890</td>
                <td><span className="badge badge-warning">Processing</span></td>
              </tr>
              <tr>
                <td><b>#LB-9023</b></td>
                <td>Apex Grocery Wholesalers</td>
                <td>Daily Essentials</td>
                <td>₹12,150</td>
                <td><span className="badge badge-success">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}