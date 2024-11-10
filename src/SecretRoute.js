// src/ProtectedRoute.js
import React from 'react';
import FaceRecognition from './FaceRecognition';
import { Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import Secret from './Secret';

const SecretRoute = ({ component: Component, ...rest }) => {
  const currentUser = auth.currentUser;
  return currentUser ?<Secret /> : <Navigate to="/login" />
      
};

export default SecretRoute;
