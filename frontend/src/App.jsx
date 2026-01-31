import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import ReportAnalysis from './components/ReportAnalysis';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setIsLoading(false);
    setError(null);
  };

  const handleError = (msg) => {
    setError(msg);
    setIsLoading(false);
  };

  return (
    <div>
      {/* Navbar with Brand */}
      <nav className="navbar">
        <div className="brand">
          <span style={{ fontSize: '1.5rem' }}>🩺</span>
          <span>MediPlain</span>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Hackathon Prototype v1.0
        </div>
      </nav>

      <div className="main-container">
        {/* Hero Text */}
        {!analysisData && !isLoading && (
          <div style={{ textAlign: 'center', margin: '3rem 0' }}>
            <h1>Understand Your Medical Reports</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Upload your lab report or paste the text below.
              Our AI breaks it down into simple terms so you can have a better conversation with your doctor.
            </p>
          </div>
        )}

        {/* Main Interface */}
        <main>
          {!analysisData && (
            <UploadSection
              onAnalysisStart={() => setIsLoading(true)}
              onAnalysisComplete={handleAnalysisComplete}
              onError={handleError}
              isLoading={isLoading}
            />
          )}

          {isLoading && !analysisData && (
            <div className="custom-card" style={{ padding: '4rem', textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
              <div className="loader" style={{ margin: '0 auto 1rem', borderColor: '#e2e8f0', borderTopColor: 'var(--primary)' }}></div>
              <h3>Analyzing Report...</h3>
              <p className="text-muted">Reading the values and generating explanations.</p>
            </div>
          )}

          {error && (
            <div className="custom-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--danger)', marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--danger)', margin: 0 }}>Unable to Process</h3>
              <p style={{ margin: '1rem 0' }}>{error}</p>
              <button className="btn-primary" onClick={() => setError(null)}>Try Again</button>
            </div>
          )}

          {analysisData && (
            <ReportAnalysis
              data={analysisData}
              onReset={() => setAnalysisData(null)}
            />
          )}
        </main>

        <footer style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem 0', color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
          <p>
            <strong>Disclaimer:</strong> This tool does <u>not</u> provide medical advice.
            It is an educational aid. Always consult a qualified professional.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
