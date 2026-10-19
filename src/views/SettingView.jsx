import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Loader2, 
  Key, 
  DollarSign, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  User,
  Radio
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3002/api/frontend';
const API_KEY = process.env.REACT_APP_API_KEY || 'lootbaazarV5kAYC7SJhFGWEnWynVjHW0UU7kA8N9x';

const tabStyles = {
  tabBar: {
    display: 'flex',
    gap: '0',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border-color, #2a2f3a)',
    maxWidth: '650px',
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

  // WhatsApp AiSensy API fields
  const [waApiKey, setWaApiKey] = useState('');
  const [waCampaignName, setWaCampaignName] = useState('lbotp');
  const [waUserName, setWaUserName] = useState('Galaxy Traders');
  const [showApiKey, setShowApiKey] = useState(false);

  // Live Test states
  const [testPhone, setTestPhone] = useState('917016685053');
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

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

      // WhatsApp AiSensy fields
      const wa = data.whatsapp || {};
      setWaApiKey(wa.apiKey || '');
      setWaCampaignName(wa.campaignName || 'lbotp');
      setWaUserName(wa.userName || 'Galaxy Traders');

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
            apiKey: waApiKey,
            campaignName: waCampaignName,
            userName: waUserName,
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

  const handleTestWhatsApp = async () => {
    if (!testPhone.trim()) {
      setTestStatus({ type: 'error', message: 'Please enter a test phone number (e.g. 917016685053)' });
      return;
    }
    if (!waApiKey.trim()) {
      setTestStatus({ type: 'error', message: 'Please provide the AiSensy API Key first.' });
      return;
    }

    try {
      setIsTesting(true);
      setTestStatus(null);
      const res = await fetch(`${API_BASE_URL}/settings/test-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          destination: testPhone.trim(),
          apiKey: waApiKey.trim(),
          campaignName: waCampaignName.trim() || 'lbotp',
          userName: waUserName.trim() || 'Galaxy Traders'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to send test OTP via AiSensy');
      }

      setTestStatus({
        type: 'success',
        message: `OTP "${data.otp}" sent successfully! Message ID: ${data.response?.submitted_message_id || 'Submitted'}`
      });
    } catch (err) {
      setTestStatus({ type: 'error', message: err.message });
    } finally {
      setIsTesting(false);
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
              Configure application parameters including payment amounts and AiSensy WhatsApp Campaign credentials.
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
          <CheckCircle2 size={16} />
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
          WhatsApp (AiSensy API)
        </button>
      </div>

      {/* Main Settings Form Card */}
      <div className="table-card" style={{ padding: '24px', maxWidth: '650px', margin: '0 auto' }}>
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

            {/* ===== WhatsApp (AiSensy API) Tab ===== */}
            {activeTab === 'whatsapp' && (
              <>
                <div style={{ 
                  padding: '14px 16px', 
                  borderRadius: '8px', 
                  backgroundColor: 'rgba(37, 211, 102, 0.08)', 
                  border: '1px solid rgba(37, 211, 102, 0.25)', 
                  color: 'var(--text-muted, #8a99ad)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <MessageCircle size={20} style={{ color: '#25D366', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ color: 'var(--text-primary, #fff)', fontWeight: 600, marginBottom: '2px' }}>
                      AiSensy WhatsApp Campaign API v2
                    </div>
                    <div>
                      Endpoint: <code style={{ color: '#25D366', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>POST https://backend.aisensy.com/campaign/t1/api/v2</code>
                    </div>
                  </div>
                </div>

                {/* AiSensy API Key */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" htmlFor="setting-aisensy-key" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Key size={14} />
                      <span>AiSensy API Key (JWT)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted, #8a99ad)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem'
                      }}
                    >
                      {showApiKey ? <EyeOff size={13} /> : <Eye size={13} />}
                      <span>{showApiKey ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    id="setting-aisensy-key"
                    type={showApiKey ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter AiSensy API Key token"
                    style={{ paddingLeft: '14px', fontFamily: showApiKey ? 'monospace' : 'inherit', fontSize: '0.85rem' }}
                    value={waApiKey}
                    onChange={(e) => setWaApiKey(e.target.value)}
                    disabled={isSaving}
                  />
                  <small style={{ color: 'var(--text-muted, #8a99ad)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    From your AiSensy Dashboard &gt; Manage &gt; API Key.
                  </small>
                </div>

                {/* Campaign Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="setting-aisensy-campaign" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Radio size={14} />
                    <span>Campaign Name</span>
                  </label>
                  <input
                    id="setting-aisensy-campaign"
                    type="text"
                    className="form-input"
                    placeholder="e.g. lbotp"
                    style={{ paddingLeft: '14px' }}
                    value={waCampaignName}
                    onChange={(e) => setWaCampaignName(e.target.value)}
                    disabled={isSaving}
                  />
                  <small style={{ color: 'var(--text-muted, #8a99ad)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    The live campaign name approved on AiSensy for OTP verification.
                  </small>
                </div>

                {/* User / Business Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="setting-aisensy-username" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} />
                    <span>Sender / Business Name (userName)</span>
                  </label>
                  <input
                    id="setting-aisensy-username"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Galaxy Traders"
                    style={{ paddingLeft: '14px' }}
                    value={waUserName}
                    onChange={(e) => setWaUserName(e.target.value)}
                    disabled={isSaving}
                  />
                  <small style={{ color: 'var(--text-muted, #8a99ad)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    Sender / Brand identity passed to AiSensy.
                  </small>
                </div>

                {/* Live Test WhatsApp Section */}
                <div style={{
                  marginTop: '10px',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color, #2a2f3a)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary, #fff)' }}>
                      <Send size={15} style={{ color: 'var(--accent-primary, #f97316)' }} />
                      <span>Test WhatsApp Message</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #8a99ad)' }}>Direct live test</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 917016685053"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      style={{ paddingLeft: '14px', flex: 1 }}
                      disabled={isTesting}
                    />
                    <button
                      type="button"
                      onClick={handleTestWhatsApp}
                      className="btn"
                      disabled={isTesting}
                      style={{
                        padding: '10px 18px',
                        backgroundColor: '#25D366',
                        color: '#000',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {isTesting ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Send Test OTP</span>
                        </>
                      )}
                    </button>
                  </div>

                  {testStatus && (
                    <div style={{
                      marginTop: '12px',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: testStatus.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      border: `1px solid ${testStatus.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      color: testStatus.type === 'success' ? '#10b981' : '#ef4444'
                    }}>
                      {testStatus.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                      <span>{testStatus.message}</span>
                    </div>
                  )}
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
