import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* We will add our Navigation Bar here later */}
        <Routes>
          <Route path="/" element={<h1>Welcome to KYC App</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
