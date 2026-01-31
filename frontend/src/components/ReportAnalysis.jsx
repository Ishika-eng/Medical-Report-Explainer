import React, { useState } from 'react';

const ReportAnalysis = ({ data, onReset }) => {
    const [language, setLanguage] = useState('en'); // 'en' or 'hi'
    const [translatedData, setTranslatedData] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);

    const toggleLanguage = async () => {
        if (language === 'en') {
            if (translatedData) {
                setLanguage('hi');
            } else {
                await translateAll();
            }
        } else {
            setLanguage('en');
        }
    };

    const translateAll = async () => {
        setIsTranslating(true);
        try {
            const translate = async (text) => {
                const res = await fetch('http://localhost:8000/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, target_lang: 'hi' })
                });
                const json = await res.json();
                return json.translated_text;
            };

            const summary = await translate(data.summary);
            const parameters = await Promise.all(data.parameters.map(async (p) => ({
                ...p,
                explanation: await translate(p.explanation)
            })));
            const questions = await Promise.all(data.questions.map(q => translate(q)));

            setTranslatedData({ summary, parameters, questions });
            setLanguage('hi');
        } catch (e) {
            console.error("Translation failed", e);
            alert("Translation failed. Please try again.");
        } finally {
            setIsTranslating(false);
        }
    };

    const currentData = language === 'hi' && translatedData ? translatedData : data;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header Actions */}
            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button
                    onClick={onReset}
                    className="btn-text"
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
                >
                    ← Back to Upload
                </button>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Prefer Hindi?</span>
                    <button
                        className="btn-primary"
                        onClick={toggleLanguage}
                        disabled={isTranslating}
                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                    >
                        {isTranslating ? 'Translating...' : (language === 'en' ? '🇮🇳 Translate' : '🇺🇸 English')}
                    </button>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) 1fr', gap: '2rem' }}>

                {/* Left Column: Analysis */}
                <div>
                    {/* Summary */}
                    <div className="custom-card mb-4" style={{ padding: '1.5rem', borderLeft: '5px solid var(--primary)' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>📊 Report Summary</h2>
                        <p style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>{currentData.summary}</p>
                    </div>

                    {/* Parameters */}
                    <div>
                        <h3 className="mb-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Detailed Readings</h3>
                        <div className="param-grid">
                            {currentData.parameters.map((param, idx) => (
                                <div key={idx} className={`param-item status-${param.status.toLowerCase()}`}>
                                    <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{param.name}</span>
                                        <span className={`badge badge-${param.status.toLowerCase()}`}>{param.status}</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                        <div>Found: <strong style={{ color: 'var(--text)' }}>{param.value}</strong></div>
                                        <div>Normal: {param.normal_range}</div>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{param.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div>
                    <div className="custom-card" style={{ padding: '1.5rem', position: 'sticky', top: '5rem' }}>
                        <h3 style={{ marginTop: 0 }}>❓ Ask Your Doctor</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Use these questions to start a conversation.</p>
                        <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem' }}>
                            {currentData.questions.map((q, idx) => (
                                <li key={idx} style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>{q}</li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReportAnalysis;
