import React from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Classifier from './components/Classifier';

function App() {
  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <div className="title-container">
          <h1>Mental Health Signal Classifier</h1>
        </div>
        <p>
          Enter a text excerpt below to see which of the seven mental-health categories 
          the classifier assigns it to, along with per-class confidence scores and 
          the top SHAP-attributed tokens.
        </p>

        <Classifier />
      </main>
    </div>
  );
}

export default App;
