import React from 'react';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 style={{ color: 'var(--warning)', fontSize: '1.25rem' }}>⚠️ Important Disclaimer</h2>
      <div className="alert-box alert-warning">
        <strong>This tool is for academic demonstration only.</strong>
        <p style={{ color: 'inherit', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          It is NOT a clinical tool, NOT a medical device, and NOT intended for mental health
          screening, triage, or diagnosis of any individual.
        </p>
      </div>
      
      <div className="alert-box alert-danger">
        <strong>If you or someone you know is in crisis:</strong>
        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
          <li>📞 Call or text <strong>988</strong></li>
          <li>🚨 Call <strong>911</strong></li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
