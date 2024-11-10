import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useUserProfile } from './hooks/hooks';
import { useNavigate } from 'react-router-dom';
function FaceRecognition() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const navigate = useNavigate();
  const [detecting, setDetecting] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [matchFound, setMatchFound] = useState(0);
  const intervalIdsRef = useRef([]);
  const { userProfile, loading: userLoading, error } = useUserProfile();
  // Load face-api.js models and known faces
  useEffect(() => {
    if (userProfile) {
    const loadModels = async () => {
        console.log("attempting to load models");
       
            const MODEL_URL = '/models';
      
            // Load models sequentially to make sure all are loaded before inference
            const tinyresult = await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            console.log(tinyresult);
            const ssdresult = await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
            console.log(ssdresult);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
              console.log("ello");
            // Load known face descriptors
            const labeledDescriptors = await loadLabeledImages();
            const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6); // Adjust threshold if needed
            setFaceMatcher(matcher);
      
            setModelsLoaded(true); // Mark models as loaded
          
        }
        loadModels();
    };

      // Cleanup function to clear all intervals on dismount
      return () => {
        console.log("DISMOUNT");
        intervalIdsRef.current.forEach((id) => {
          clearInterval(id); // Clear each interval
        });
        intervalIdsRef.current = []; // Clear the array to remove all stored interval IDs
      };
  }, [userProfile]);

  // Load labeled images and create face descriptors for known faces
  const loadLabeledImages = async () => {
    const labels = [userProfile.name]; // Replace with actual names
    return Promise.all(
      labels.map(async (label) => {

        try {
            console.log("userProfile profile image")
            console.log(userProfile.profileImage);
            if (userProfile.profileImage === "" || userProfile.profileImage === undefined) return;
          const img = await faceapi.fetchImage(userProfile.profileImage);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          if (!detections) {
            throw new Error(`No faces detected for ${label}`);
          }
          return new faceapi.LabeledFaceDescriptors(label, [detections.descriptor]);
        } catch (error) {
          console.error(`Error loading image for ${label}:`, error);
          return [];
        }
      })
    );
  };

  // Start webcam and detect/recognize faces
  useEffect(() => {
    if (modelsLoaded && faceMatcher) {
        console.log("models loaded");
      // Access webcam only after models are loaded
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => console.error("Error accessing webcam:", error));

      // Once the video starts playing, perform face recognition
      videoRef.current && videoRef.current.addEventListener('play', async () => {
        if (!modelsLoaded || !faceMatcher) return;

        const displaySize = {
          width: videoRef.current.width,
          height: videoRef.current.height,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);

        // Continuous face detection every 100ms
        const id = setInterval(async () => {
            console.log(detecting);
          if (!videoRef.current) return;

          const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          // Clear previous drawings on canvas
          canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          // Draw boxes around detected faces and label recognized faces
          resizedDetections.forEach((detection) => {
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
            if (detecting) {
                const matchName = bestMatch.toString().split(" ")[0];
                console.log(matchName);
                console.log(userProfile.name);
                if (matchName === userProfile.name) {
                    console.log(matchFound);
                    setMatchFound(4);
                }
                if (matchFound > 3) {
                    setDetecting(false);
                }
            }
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.toString() });
            drawBox.draw(canvasRef.current);
          });
        }, 100);
        console.log(id);
        // Store interval IDs
    intervalIdsRef.current.push(id);

      });
    }
  }, [modelsLoaded, detecting, faceMatcher]);

  return (
    <div className="homepage flex-col flex items-center  p-12 w-full h-full bioscanner">
        
      <h1 className="gradient-text text-6xl my-12">BioScanner</h1>
      {(!modelsLoaded || !faceMatcher) ? (
        <>
        <p>{userProfile?.Name}</p>
        
        <p className="t my-12 text-white">Loading...</p>
        </>
      ) : (
        <div className="relative w-full" style={{height: "600px"}}>
           <video className="video"ref={videoRef} width="720" height="560" style={{ position: 'absolute' }} autoPlay muted />
           <canvas ref={canvasRef} className="canvas" width="720" height="560" style={{ position: 'absolute' }} />
        </div>
      )}
     { matchFound < 3 ? (
    <>
    <button className="mb-3 glowing-button" onClick={()=> {
        console.log("scan face");
        setDetecting(true);
      }}>Scan Face</button>
     {detecting ? (<p className="text-white">Currently detecting... if the correct biometrics are detected for 3 seconds, you may proceed.</p>) : (<p className="text-white">Currently not detecting</p>)}
      
      </>
   ) : (
    <button className="glowing-button" onClick={()=> {
        console.log("DISMOUNT CLEANUP");
        intervalIdsRef.current.forEach((id) => {
          clearInterval(id); // Clear each interval
        });
        intervalIdsRef.current = []; // Clear the array to remove all stored interval IDs
        setTimeout(()=> {
            navigate("/secret")
        },1000)
      
      }}>Enter the system</button>
   )}
    </div>
  );
}

export default FaceRecognition;
