import React from 'react';
import { Sparkles, CalendarDays } from 'lucide-react';

export default function EventBannersView() {
  return (
    <div className="animate-fade">
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-title">Live Promos</div>
            <div className="stat-value">4</div>
          </div>
          <div className="stat-icon blue">
            <Sparkles size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-title">Upcoming Expos</div>
            <div className="stat-value">2</div>
          </div>
          <div className="stat-icon emerald">
            <CalendarDays size={24} />
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="table-title-container">
            <h2 className="table-title">Festive & Event Campaigns</h2>
            <span className="table-subtitle">Configure scheduling variables and graphic placement tags for seasonal flash sales.</span>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Target Event</th>
                <th>Duration Frame</th>
                <th>Placement Node</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Diwali Mega Loot Auction</b></td>
                <td>Diwali Festival 2026</td>
                <td>Oct 20 - Nov 05</td>
                <td>Home Top Carousel</td>
                <td><span className="badge badge-success">Active</span></td>
              </tr>
              <tr>
                <td><b>Monsoon Clearance Expo</b></td>
                <td>End of Season Sale</td>
                <td>Jul 01 - Jul 15</td>
                <td>Sidebar Widget Left</td>
                <td><span className="badge badge-info">Scheduled</span></td>
              </tr>
              <tr>
                <td><b>Eid Special Gift Bazaar</b></td>
                <td>Festive Bazaar Run</td>
                <td>Completed</td>
                <td>Home Grid Banner 2</td>
                <td><span className="badge badge-muted">Archived</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}