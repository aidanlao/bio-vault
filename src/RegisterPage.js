// src/RegisterPage.js
import React, { useState } from 'react';
import useRegister from './hooks/hooks'; // Import the hook
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [faceImage, setFaceImage] = useState(null);
  const { register, error, loading } = useRegister();
  const navigate = useNavigate();

  // Handle the face image file input
  const handleImageUpload = (e) => {
    console.log("handle");
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setFaceImage(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!faceImage) {
      alert("Please upload a face image");
      return;
    }

    const user = await register(email, password, name, faceImage);
    if (user) {
      navigate('/login'); // Redirect to login page after successful registration
    }
  };

  return (
    <div className="homepage w-full min-h-screen flex-col flex items-center justify-center">
      <div className="max-w-1/2">
      <h2 className="gradient-text text-3xl mb-5 leading-10">Register</h2>
 
    
      <form className="flex-col gap-3 flex"onSubmit={handleRegister}>
        <div >
          <input
          className="input"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <input className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="w-full">
        
      {
        !faceImage ? ( 
          <label for="file-upload" class="file-upload-label">
  <span>Choose a file</span>
  <input
  id="file-upload"
          className="file-upload-input"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          required
        />
</label>
         
      ) : (<p className="text-white">{faceImage?.name}</p>)
      } 

        </div>
        {error && <p>{error}</p>}
        <button type="submit" className="glowing-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>     </div>
    </div>
  );
}

export default RegisterPage;
