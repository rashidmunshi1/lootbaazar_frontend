import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, Key, DollarSign } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/frontend';
const API_KEY = process.env.REACT_APP_API_KEY || 'lootbaazarV5kAYC7SJhFGWEnWynVjHW0UU7kA8N9x';

export default function SettingView() {
  const [apiKey, setApiKey] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/settings`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setApiKey(data.apiKey || '');
      setAmount(data.amount || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load settings from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    try {
      setIsSaving(true);
      const res = await fetch(`${API_BASE_URL}/settings/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          apiKey,
          amount: Number(amount) || 0
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.message || 'Failed to save settings');
      }

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade">
      {/* Header Card */}
      <div className="stats-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="stat-title" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary, #fff)' }}>Global Settings</div>
            <div className="stat-subtitle" style={{ fontSize: '0.875rem', color: 'var(--text-muted, #8a99ad)', marginTop: '4px' }}>
              Configure application parameters such as the default API gateway credentials and payment amount triggers.
            </div>
          </div>
          <div className="stat-icon purple">
            <Settings size={24} />
          </div>
        </div>
      </div>

      {error && (
        <div className="login-error" style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px' }}>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{ 
          marginBottom: '16px', 
          padding: '12px', 
          borderRadius: '8px', 
          backgroundColor: 'rgba(16, 185, 129, 0.1)', 
          border: '1px solid rgba(16, 185, 129, 0.2)', 
          color: '#10b981', 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{success}</span>
        </div>
      )}

      {/* Main Settings Form Card */}
      <div className="table-card" style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 12px auto' }} />
            <span>Loading settings...</span>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="setting-apikey" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} />
                <span>API Key</span>
              </label>
              <input
                id="setting-apikey"
                type="text"
                className="form-input"
                placeholder="Enter API Key"
                style={{ paddingLeft: '14px' }}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="setting-amount" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={14} />
                <span>Amount</span>
              </label>
              <input
                id="setting-amount"
                type="number"
                step="any"
                className="form-input"
                placeholder="Enter Amount"
                style={{ paddingLeft: '14px' }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }} disabled={isSaving}>
                {isSaving ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Save size={16} />
                    <span>Save Settings</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
