// App.jsx
import React, { useState } from 'react';
import './App.css';

function App() {
  const [mermaidUrl, setMermaidUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageType, setImageType] = useState('png');
  const [imageWidth, setImageWidth] = useState(4000);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError('');
    if (!mermaidUrl) {
      setError('Please enter a Mermaid URL');
      return;
    }

    try {
      const url = new URL(mermaidUrl);
      const hashPart = url.hash.substring(1); // Remove the # character
      
      if (hashPart.startsWith('pako:')) {
        const pakoCode = hashPart.substring(5); // Remove 'pako:' prefix
        const newImageUrl = `https://mermaid.ink/img/pako:${pakoCode}?type=${imageType}&width=${imageWidth}`;
        setImageUrl(newImageUrl);
      } else {
        throw new Error('Invalid URL format');
      }
    } catch (error) {
      setError('Invalid Mermaid URL. Make sure it starts with https://mermaid.live/edit#pako:');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(imageUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setError('Failed to copy URL. Please copy it manually.');
      });
  };

  return (
    <div className="app-container">
      <div className="converter-card">
        <h1>Mermaid Link Converter</h1>
        
        <div className="instructions">
          <p>Paste a Mermaid Live Editor URL and get an image URL that you can use anywhere.</p>
        </div>
        
        <div className="input-group">
          <label htmlFor="mermaidUrl">Mermaid Live Editor URL</label>
          <input
            type="text"
            id="mermaidUrl"
            value={mermaidUrl}
            onChange={(e) => setMermaidUrl(e.target.value)}
            placeholder="https://mermaid.live/edit#pako:..." 
          />
        </div>
        
        <div className="settings">
          <div className="setting-group">
            <label htmlFor="imageType">Image Type:</label>
            <select 
              id="imageType" 
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
            >
              <option value="png">PNG</option>
              <option value="svg">SVG</option>
            </select>
          </div>
          
          <div className="setting-group">
            <label htmlFor="imageWidth">Width:</label>
            <input 
              type="number" 
              id="imageWidth"
              value={imageWidth}
              onChange={(e) => setImageWidth(e.target.value)} 
              min="100" 
              max="10000" 
            />
          </div>
        </div>
        
        <button onClick={handleConvert} className="convert-btn">Convert</button>
        
        {error && <div className="error-message">{error}</div>}
        
        {imageUrl && (
          <div className="result">
            <h2>Result</h2>
            <div className="image-container">
              <img 
                src={imageUrl} 
                alt="Mermaid diagram" 
                onError={() => setError('Failed to load image. The Mermaid code may be invalid.')}
              />
            </div>
            <div className="url-section">
              <p><strong>Image URL:</strong></p>
              <div className="url-display">{imageUrl}</div>
              <button 
                onClick={handleCopy} 
                className="copy-btn"
              >
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;