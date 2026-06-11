import React from 'react';

const getColorClass = (className) => {
  if (className === 'Stress') return 'color-stress';
  if (className === 'Depression') return 'color-depression';
  if (className === 'Bipolar Disorder') return 'color-bipolar';
  if (className === 'Personality Disorder') return 'color-personality';
  if (className === 'Anxiety') return 'color-anxiety';
  if (className === 'Suicidal') return 'color-suicidal';
  if (className === 'Normal') return 'color-normal';
  return '';
};

function ResultsPanel({ results }) {
  if (!results) return null;

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 className="mb-4">Prediction Results</h2>
      
      {/* Primary Prediction */}
      <div style={{
        background: `var(--${getColorClass(results.predictedClass).replace('color-', '')}-bg, rgba(99, 102, 241, 0.2))`,
        border: `1px solid var(--primary-color)`,
        padding: '1rem',
        borderRadius: '8px',
        color: 'white',
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '2rem'
      }}>
        Predicted class: {results.predictedClass}
      </div>

      {/* Confidence Bars */}
      <div className="mb-4">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'white' }}>Per-class Confidence</h3>
        {Object.entries(results.confidences).map(([className, confidence]) => (
          <div key={className} className="confidence-row">
            <div className="class-name">{className}</div>
            <div className="bar-bg">
              <div 
                className={`bar-fill ${getColorClass(className)}`} 
                style={{ width: `${Math.round(confidence * 100)}%` }}
              ></div>
            </div>
            <div className="confidence-val">{(confidence * 100).toFixed(1)}%</div>
          </div>
        ))}
      </div>

      {/* SHAP Tokens */}
      {results.tokens && results.tokens.length > 0 && (
        <div className="shap-table-container">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'white' }}>Top SHAP-Attributed Tokens</h3>
          <table className="shap-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>SHAP value</th>
                <th>Direction</th>
              </tr>
            </thead>
            <tbody>
              {results.tokens.map((tokenObj, idx) => (
                <tr key={idx}>
                  <td>{tokenObj.token}</td>
                  <td>{tokenObj.value.toFixed(4)}</td>
                  <td className={tokenObj.value > 0 ? 'shap-supports' : 'shap-opposes'}>
                    {tokenObj.value > 0 ? '↑ supports' : '↓ opposes'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom Reminder */}
      <div className="alert-box alert-danger" style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
        <span style={{ color: 'inherit' }}>⚠️ <strong>Reminder:</strong> This is an academic demonstration only. The prediction above is NOT a clinical assessment and should NOT be used to make any decisions about health or safety.</span>
      </div>
    </div>
  );
}

export default ResultsPanel;
