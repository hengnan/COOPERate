import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ReviewsPage from './Pages/Reviews.js';

function App() {
  return (
      <Router>
          <Routes>
              <Route exact path="/" element={<ReviewsPage />} />
          </Routes>
      </Router>
  );
}

export default App;