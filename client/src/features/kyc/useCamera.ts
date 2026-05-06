import { useState, useRef, useCallback, useEffect } from 'react';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = useCallback(async (requireAudio = false) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: requireAudio 
      });
      
      setStream(mediaStream);
      setError('');
    } catch (err) {
      setError('Camera access denied or device not found. Please allow permissions.');
      console.error(err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  return { stream, videoRef, error, startCamera, stopCamera };
};
