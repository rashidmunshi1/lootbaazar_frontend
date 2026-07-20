import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, Key, DollarSign, MessageCircle, Phone, Lock, FileText, Globe, Hash } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/frontend';
const API_KEY = process.env.REACT_APP_API_KEY || 'lootbaazarV5kAYC7SJhFGWEnWynVjHW0UU7kA8N9x';

const tabStyles = {
  tabBar: {
    display: 'flex',
    gap: '0',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border-color, #2a2f3a)',
    maxWidth: '600px',
    margin: '0 auto 24px auto',
  },
  tab: (isActive) => ({
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: isActive ? 'var(--accent-primary, #f97316)' : 'var(--text-muted, #8a99ad)',
    background: 'transparent',
    border: 'none',
    borderBottom: isActive ? '2px solid var(--accent-primary, #f97316)' : '2px solid transparent',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
  }),
};

export default function SettingView() {
  const [activeTab, setActiveTab] = useState('general');
  const [apiKey, setApiKey] = useState('');
  const [amount, setAmount] = useState(0);

  // WhatsApp Meta API fields
  const [waPhoneNumberId, setWaPhoneNumberId] = useState('');
  const [waAccessToken, setWaAccessToken] = useState('');
  const [waTemplateName, setWaTemplateName] = useState('');
  const [waTemplateLanguage, setWaTemplateLanguage] = useState('');
  const [waTemplateParamsCount, setWaTemplateParamsCount] = useState(0);

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

      // WhatsApp fields
      const wa = data.whatsapp || {};
      setWaPhoneNumberId(wa.phoneNumberId || '');
      setWaAccessToken(wa.accessToken || '');
      setWaTemplateName(wa.templateName || '');
      setWaTemplateLanguage(wa.templateLanguage || '');
      setWaTemplateParamsCount(wa.templateParamsCount || 0);

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
          amount: Number(amount) || 0,
          whatsapp: {
            phoneNumberId: waPhoneNumberId,
            accessToken: waAccessToken,
            templateName: waTemplateName,
            templateLanguage: waTemplateLanguage,
            templateParamsCount: Number(waTemplateParamsCount) || 0,
          }
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

      {/* Tab Bar */}
      <div style={tabStyles.tabBar}>
        <button
          style={tabStyles.tab(activeTab === 'general')}
          onClick={() => setActiveTab('general')}
          type="button"
        >
          <Settings size={16} />
          General
        </button>
        <button
          style={tabStyles.tab(activeTab === 'whatsapp')}
          onClick={() => setActiveTab('whatsapp')}
          type="button"
        >
          <MessageCircle size={16} />
          WhatsApp (Meta API)
        </button>
      </div>

      {/* Main Settings Form Card */}
      <div className="table-card" style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 12px auto' }} />
            <span>Loading settings...</span>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ===== General Tab ===== */}
            {activeTab === 'general' && (
              <>
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
              </>
            )}

            {/* ===== WhatsApp (Meta API) Tab ===== */}
            {activeTab === 'whatsapp' && (
              <>
                <div style={{ 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  backgroundColor: 'rgba(37, 211, 102, 0.08)', 
                  border: '1px solid rgba(37, 211, 102, 0.2)', 
                  color: 'var(--text-muted, #8a99ad)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <MessageCircle size={16} style={{ color: '#25D366', flexShrink: 0 }} />
                  <span>Configure your WhatsApp Business API credentials from <strong style={{ color: 'var(--text-primary, #fff)' }}>Meta Developer Portal</strong>.</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="setting-wa-phone-id" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} />
                    <span>Phone Number ID</span>
                  </label>
                  <input
                    id="setting-wa-phone-id"
                    type="text"
                    className="form-input"
                    placeholder="Enter Phone Number ID"
                    style={{ paddingLeft: '14px' }}
                    value={waPhoneNumberId}
                    onChange={(e) => setWaPhoneNumberId(e.target.value)}
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="setting-wa-access-token" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={14} />
                    <span>Access Token</span>
                  </label>
                  <input
                    id="setting-wa-access-token"
                    type="password"
                    className="form-input"
                    placeholder="Enter Access Token"
                    style={{ paddingLeft: '14px' }}
                    value={waAccessToken}
                    onChange={(e) => setWaAccessToken(e.target.value)}
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="setting-wa-template-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} />
                    <span>Template Name</span>
                  </label>
                  <input
                    id="setting-wa-template-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. order_confirmation"
                    style={{ paddingLeft: '14px' }}
                    value={waTemplateName}
                    onChange={(e) => setWaTemplateName(e.target.value)}
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="setting-wa-template-lang" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={14} />
                    <span>Template Language</span>
                  </label>
                  <input
                    id="setting-wa-template-lang"
                    type="text"
                    className="form-input"
                    placeholder="e.g. en_US"
                    style={{ paddingLeft: '14px' }}
                    value={waTemplateLanguage}
                    onChange={(e) => setWaTemplateLanguage(e.target.value)}
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="setting-wa-template-params" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Hash size={14} />
                    <span>Template Parameters Count</span>
                  </label>
                  <input
                    id="setting-wa-template-params"
                    type="number"
                    min="0"
                    className="form-input"
                    placeholder="e.g. 3"
                    style={{ paddingLeft: '14px' }}
                    value={waTemplateParamsCount}
                    onChange={(e) => setWaTemplateParamsCount(e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </>
            )}

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
