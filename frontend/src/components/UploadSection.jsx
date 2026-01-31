import React, { useState } from 'react';

const UploadSection = ({ onAnalysisStart, onAnalysisComplete, onError, isLoading }) => {
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'text'
    const [textInput, setTextInput] = useState('');

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        submitData(formData);
    };

    const handleTextSubmit = () => {
        if (!textInput.trim()) return;

        const formData = new FormData();
        formData.append('text', textInput);

        submitData(formData);
    };

    const submitData = async (formData) => {
        onAnalysisStart();

        try {
            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Analysis failed');
            }

            const data = await response.json();
            onAnalysisComplete(data);
        } catch (err) {
            console.error(err);
            onError(err.message || "Failed to analyze report. Please try again.");
        }
    };

    return (
        <div className="custom-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                <button
                    className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
                    style={{ flex: 1 }}
                    onClick={() => setActiveTab('upload')}
                >
                    📂 Upload Image/PDF
                </button>
                <button
                    className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
                    style={{ flex: 1 }}
                    onClick={() => setActiveTab('text')}
                >
                    📝 Paste Text
                </button>
            </div>

            <div style={{ padding: '2rem' }}>
                {activeTab === 'upload' ? (
                    <div className="text-center">
                        <label htmlFor="file-upload" className="upload-box" style={{ display: 'block' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📷</div>
                            <p className="mb-4" style={{ fontWeight: 500 }}>Click to browse or drag file here</p>
                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Supports JPG, PNG (Max 5MB)</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileUpload}
                            disabled={isLoading}
                            style={{ display: 'none' }}
                            id="file-upload"
                        />
                    </div>
                ) : (
                    <div>
                        <textarea
                            placeholder="Paste the full content of your medical report here..."
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            disabled={isLoading}
                            rows={8}
                        />
                        <button
                            className="btn-primary w-full mt-4"
                            onClick={handleTextSubmit}
                            disabled={isLoading || !textInput.trim()}
                        >
                            Analyze Report
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadSection;
