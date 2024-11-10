import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FaceRecognition from './FaceRecognition';
// Components for different pages
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProtectedRoute from './ProtectedRoute';
import Home from './Home';
import SecretRoute from './SecretRoute';

function App() {
  return (
    <Router>
      <div>
        {/* Navigation links */}
        

        {/* Define routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* ProtectedRoute example */}
          <Route 
            path="/facerec" 
            element={<ProtectedRoute />} 
          />
           <Route 
            path="/secret" 
            element={<SecretRoute />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
