// src/ProtectedRoute.js
import React from 'react';
import FaceRecognition from './FaceRecognition';
import { Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const currentUser = auth.currentUser;
  return currentUser ?<FaceRecognition /> : <Navigate to="/login" />
      
};

export default ProtectedRoute;
