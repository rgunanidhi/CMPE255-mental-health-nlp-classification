import React, { useState } from 'react';

function ClassifierInput({ onSubmit, isPredicting }) {
  const [text, setText] = useState('');

  const handleClassify = () => {
    if (!text.trim()) return;
    onSubmit(text);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <textarea 
        placeholder="I've been feeling really anxious lately, can't sleep and keep worrying about everything..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button 
        onClick={handleClassify} 
        disabled={isPredicting || !text.trim()}
        style={{ width: '100%', marginTop: '1rem', opacity: isPredicting || !text.trim() ? 0.7 : 1 }}
      >
        {isPredicting ? 'Running inference...' : 'Classify'}
      </button>
    </div>
  );
}

export default ClassifierInput;
