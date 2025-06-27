import React, { useState, useEffect } from 'react';
import axios from '../axios';
import "../App.css";

// Main App component
function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct1Id, setSelectedProduct1Id] = useState('');
  const [selectedProduct2Id, setSelectedProduct2Id] = useState('');
  const [comparisonResult, setComparisonResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Effect to load products when the component mounts
  useEffect(() => {
    // Fetch products from backend API and their images (using Home.jsx logic)
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        const productsWithImages = await Promise.all(
          res.data.map(async (product) => {
            try {
              const imgRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/${product.id}/image`);
              if (imgRes.data && imgRes.data.trim() !== "" && imgRes.data !== "null") {
                const imageUrl = `data:${product.imageType || "image/jpeg"};base64,${imgRes.data}`;
                return { ...product, imageUrl };
              } else {
                throw new Error("Invalid image data");
              }
            } catch (error) {
              try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/${product.id}/imagename`);
                const imageUrl = `${import.meta.env.VITE_BACKEND_URL}${response.data}`;
                return { ...product, imageUrl };
              } catch (blobError) {
                return { ...product, imageUrl: "/placeholder.jpg" };
              }
            }
          })
        );
        setProducts(productsWithImages);
      } catch (err) {
        setErrorMessage('Failed to fetch products from server.');
      }
    };
    fetchProducts();
  }, []);

  // Function to get a product object by its ID
  const getProductById = (id) => {
    return products.find(p => String(p.id) === String(id));
  };

  // Function to handle the comparison logic with Gemini AI
  const handleCompare = async () => {
    setErrorMessage('');
    setComparisonResult('');

    const product1 = getProductById(selectedProduct1Id);
    const product2 = getProductById(selectedProduct2Id);

    if (!product1 || !product2) {
      setErrorMessage('Please select two different products to compare.');
      return;
    }

    if (String(product1.id) === String(product2.id)) {
      setErrorMessage('Please select two *different* products for comparison.');
      return;
    }

    setIsLoading(true);
    let chatHistory = [];

    // Construct a slightly more detailed prompt for Gemini
    const prompt = `Compare the following two products based on their name and price. Discuss which one offers better value for money, mention possible reasons a user might prefer one over the other, and provide a clear conclusion on which to buy for a general user. Keep the response concise but include at least 2-3 points of comparison before the final recommendation.

    Product 1: ${product1.name}, Price: ₹${product1.price}
    Product 2: ${product2.name}, Price: ₹${product2.price}

    Please provide a short but detailed comparison and a final recommendation.`;

    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };

    // API Key is left empty, Canvas will automatically provide it at runtime.
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setComparisonResult(text);
      } else {
        setErrorMessage('No comparison result from AI. Please try again.');
        console.error('Unexpected AI response structure:', result);
      }
    } catch (error) {
      setErrorMessage(`Failed to get comparison: ${error.message}. Check console for details.`);
      console.error('Gemini API call failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="comparator-bg">
      <div className="comparator-container">
        <h1 className="comparator-title">SaverrAI</h1>
        <div className="comparator-select-row">
          <div className="comparator-select-card">
            <label htmlFor="product1" className="comparator-label">Select Product 1:</label>
            <select
              id="product1"
              value={selectedProduct1Id}
              onChange={(e) => setSelectedProduct1Id(e.target.value)}
              className="comparator-select"
            >
              <option value="">-- Choose Product 1 --</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (₹{product.price.toFixed(2)})
                </option>
              ))}
            </select>
            {selectedProduct1Id && getProductById(selectedProduct1Id) && (
              <div className="comparator-product-preview">
                <img
                  src={getProductById(selectedProduct1Id).imageUrl}
                  alt={getProductById(selectedProduct1Id).name}
                  className="comparator-product-img"
                  onError={(e) => e.target.src = 'https://placehold.co/128x96/E0E0E0/666666?text=No+Image'}
                />
                <p className="comparator-product-name">{getProductById(selectedProduct1Id).name}</p>
                <p className="comparator-product-price">₹{getProductById(selectedProduct1Id).price.toFixed(2)}</p>
              </div>
            )}
          </div>
          <span className="comparator-vs">VS</span>
          <div className="comparator-select-card">
            <label htmlFor="product2" className="comparator-label">Select Product 2:</label>
            <select
              id="product2"
              value={selectedProduct2Id}
              onChange={(e) => setSelectedProduct2Id(e.target.value)}
              className="comparator-select"
            >
              <option value="">-- Choose Product 2 --</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (₹{product.price.toFixed(2)})
                </option>
              ))}
            </select>
            {selectedProduct2Id && getProductById(selectedProduct2Id) && (
              <div className="comparator-product-preview">
                <img
                  src={getProductById(selectedProduct2Id).imageUrl}
                  alt={getProductById(selectedProduct2Id).name}
                  className="comparator-product-img"
                  onError={(e) => e.target.src = 'https://placehold.co/128x96/E0E0E0/666666?text=No+Image'}
                />
                <p className="comparator-product-name">{getProductById(selectedProduct2Id).name}</p>
                <p className="comparator-product-price">₹{getProductById(selectedProduct2Id).price.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleCompare}
          disabled={isLoading || !selectedProduct1Id || !selectedProduct2Id}
          className={`comparator-btn${isLoading ? ' comparator-btn-disabled' : ''}`}
        >
          {isLoading ? (
            <span className="comparator-loading">
              <svg className="comparator-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Comparing...
            </span>
          ) : (
            'Compare Products with AI'
          )}
        </button>
        {errorMessage && (
          <div className="comparator-error" role="alert">
            <p className="comparator-error-title">Error:</p>
            <p>{errorMessage}</p>
          </div>
        )}
        {comparisonResult && (
          <div className="comparator-result">
            <h2 className="comparator-result-title">AI Comparison & Recommendation:</h2>
            <div className="comparator-result-content">
              {comparisonResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
