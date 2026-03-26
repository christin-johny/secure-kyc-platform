import React, { useState, useRef } from 'react';
import { useCamera } from './useCamera';

const KycCapture = () => {
  const { stream, videoRef, error, startCamera, stopCamera } = useCamera();
  
  const [mode, setMode] = useState(null); // Tracks if user clicked 'image' or 'video'
  const [capturedImage, setCapturedImage] = useState(null);
  const [recordedVideo, setRecordedVideo] = useState(null);
  
  // MediaRecorder API references
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const chunksRef = useRef([]);

  // --- Start Up Functions ---
  const handleStartImage = () => {
    setMode('image');
    setCapturedImage(null);
    startCamera(false); // No mic needed for photo
  };

  const handleStartVideo = () => {
    setMode('video');
    setRecordedVideo(null);
    startCamera(true); // Mic required for video
  };

  // --- Core Logic: Capture Image ---
  const captureImage = () => {
    if (!videoRef.current) return;
    
    // Draw the current video frame onto a hidden canvas
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to a Base64 Image URL
    const imageUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageUrl);
    stopCamera();
  };

  // --- Core Logic: Record Video ---
  const startRecording = () => {
    if (!stream) return;
    setIsRecording(true);
    chunksRef.current = [];
    
    // Initialize the native MediaRecorder
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    // Push chunks of video data into our array as they become available
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    
    // When stopped, stitch chunks together into a single blob file
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      setRecordedVideo(videoUrl);
      setIsRecording(false);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      stopCamera();
    }
  };

  // --- JavaScript Validation ---
  const handleSubmit = () => {
    if (mode === 'image' && !capturedImage) {
      alert("Validation Error: Please capture an image first.");
      return;
    }
    if (mode === 'video' && !recordedVideo) {
      alert("Validation Error: Please record a video first.");
      return;
    }
    alert("KYC Validated Successfully! (We will upload this to the backend later)");
  };

  // --- UI Render ---
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '40px auto', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '10px' }}>KYC Verification</h2>
      <p style={{ marginBottom: '20px' }}>Please complete your Video or Image KYC to continue.</p>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <button onClick={handleStartImage} className="btn-primary">📷 Image KYC Mode</button>
        <button onClick={handleStartVideo} className="btn-primary" style={{ backgroundColor: '#10b981' }}>🎥 Video KYC Mode</button>
      </div>

      {stream && (
        <div style={{ marginBottom: '20px' }}>
          {/* Muted must be true when recording video to prevent horrible echo feedback loops! */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted={mode === 'video'} 
            style={{ width: '100%', borderRadius: '8px', backgroundColor: '#000' }}
          />
          
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            {mode === 'image' && (
              <button onClick={captureImage} className="btn-primary" style={{ width: '100%' }}>Take Photo</button>
            )}
            
            {mode === 'video' && !isRecording && (
              <button onClick={startRecording} className="btn-primary" style={{ backgroundColor: '#ef4444', width: '100%' }}>🔴 Start Recording</button>
            )}
            
             {mode === 'video' && isRecording && (
              <button onClick={stopRecording} className="btn-primary" style={{ backgroundColor: '#f59e0b', width: '100%' }}>⏹ Stop Recording</button>
            )}
          </div>
        </div>
      )}

      {capturedImage && mode === 'image' && (
        <div>
          <h3 style={{ marginBottom: '10px' }}>Captured Image:</h3>
          <img src={capturedImage} alt="KYC" style={{ width: '100%', borderRadius: '8px' }} />
        </div>
      )}

      {recordedVideo && mode === 'video' && (
        <div>
          <h3 style={{ marginBottom: '10px' }}>Recorded Video:</h3>
          <video src={recordedVideo} controls style={{ width: '100%', borderRadius: '8px' }} />
        </div>
      )}

      {(capturedImage || recordedVideo) && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}>Submit KYC</button>
        </div>
      )}
    </div>
  );
};

export default KycCapture;
