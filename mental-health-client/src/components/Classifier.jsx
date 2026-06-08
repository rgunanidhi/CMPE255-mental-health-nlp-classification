import React, { useState } from 'react';
import ClassifierInput from './ClassifierInput';
import ResultsPanel from './ResultsPanel';

function Classifier() {
  const [isPredicting, setIsPredicting] = useState(false);
  const [results, setResults] = useState(null);

  const handleClassify = async (text) => {
    setIsPredicting(true);
    setResults(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${apiUrl}/api/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to the classification server. Make sure the backend is running!");
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <>
      <ClassifierInput 
        onSubmit={handleClassify} 
        isPredicting={isPredicting} 
      />
      
      <ResultsPanel results={results} />
    </>
  );
}

export default Classifier;
