import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function ExcelUploadView() {
  const [isUploaded, setIsUploaded] = useState(false);

  return (
    <div className="animate-fade">
      <div className="table-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          background: isUploaded ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 85, 0, 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: isUploaded ? 'var(--accent-success)' : 'var(--accent-primary)',
          marginBottom: '20px'
        }}>
          {isUploaded ? <CheckCircle2 size={32} /> : <UploadCloud size={32} />}
        </div>

        <h3 className="table-title" style={{ fontSize: '20px' }}>Bulk Store Inventory Manifest Sync</h3>
        <p className="table-subtitle" style={{ maxWidth: '480px', margin: '8px auto 24px', lineLight: '1.6' }}>
          Upload structured spreadsheet records to globally create, adjust, or batch-update business products and categories into the live database framework instance.
        </p>

        {!isUploaded ? (
          <div 
            onClick={() => setIsUploaded(true)}
            style={{ 
              width: '100%', 
              maxWidth: '500px', 
              padding: '40px 20px', 
              border: '2px dashed var(--border-color)', 
              borderRadius: '12px', 
              background: 'var(--bg-tertiary)', 
              cursor: 'pointer',
              transition: 'border-color var(--transition-fast)'
            }}
            className="excel-dropzone"
          >
            <FileSpreadsheet size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>Click to browse computer catalogs</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Supports .XLS, .XLSX, or .CSV formatted schemas</div>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: '500px', padding: '20px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'left', marginBottom: '20px' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-success)', fontSize: '14px' }}>✓ merchant_inventory_dump_2026.xlsx</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Size: 4.2 MB • Found: 1,240 Rows mapped • Ready to validate</div>
            <button 
              onClick={() => setIsUploaded(false)}
              className="btn btn-secondary" 
              style={{ marginTop: '12px', padding: '6px 12px', fontSize: '11px' }}
            >
              Clear Selection
            </button>
          </div>
        )}

        <button 
          disabled={!isUploaded}
          className="btn btn-primary" 
          style={{ marginTop: '16px', opacity: isUploaded ? 1 : 0.5, cursor: isUploaded ? 'pointer' : 'not-allowed' }}
        >
          Stream Inventory Logs Matrix
        </button>
      </div>
    </div>
  );
}