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
        <p style={{ color: 'inherit', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Predictions are produced by a machine-learning model trained on public Reddit posts and should not be used to make decisions about anyone's health or safety.
        </p>
      </div>
      
      <div className="alert-box alert-warning">
        <strong>If you or someone you know is in crisis:</strong>
        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
          <li>📞 Call or text 988 (Suicide & Crisis Lifeline)</li>
          <li>🚨 Call 911 or go to the nearest emergency room</li>
          <li>💬 Crisis Text Line: text HOME to 741741</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.85rem', fontWeight: '500' }}>
        Project: CMPE-255, Section 34, Spring 2026
      </div>
    </aside>
  );
}

export default Sidebar;
