import { useState, useRef, useCallback } from 'react';

export const useCamera = () => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const videoRef = useRef(null);

  // Function to request camera/mic permissions
  const startCamera = useCallback(async (requireAudio = false) => {
    try {
      // Access the native WebRTC API
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }, // Pre-select front camera for mobile
        audio: requireAudio 
      });
      
      setStream(mediaStream);
      
      // Attach the stream to our HTML <video> tag
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError('Camera access denied or device not found. Please allow permissions.');
      console.error(err);
    }
  }, []);

  // Function to turn off the physical camera light
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  return { stream, videoRef, error, startCamera, stopCamera };
};
