// src/hooks/useRegister.js
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

import { onAuthStateChanged } from 'firebase/auth';
const useRegister = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async (email, password, name, faceImage) => {
    setLoading(true);
    setError(null);

    try {
      // Register the user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload face image to Firebase Storage
      const imageRef = ref(storage, `user_faces/${user.uid}.jpg`);
      await uploadBytes(imageRef, faceImage);

      // Get the image URL from Firebase Storage
      const imageUrl = await getDownloadURL(imageRef);

      // Save the user's name, email, and face image URL to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        profileImage: imageUrl, // Save image URL
      });

      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      console.log(err.message);
      setError(err.message);
    }
  };

  return { register, error, loading };
};

export default useRegister;



export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async (userId) => {
      try {
        console.log("fetching use rprofile");
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const { name, profileImage } = userDoc.data();
          setUserProfile({ name, profileImage });
          console.log("found");
        } else {
          setError("User profile not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserProfile(user.uid);
      } else {
        setUserProfile({ name: '', profileImage: '' });
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { userProfile, loading, error };
};

