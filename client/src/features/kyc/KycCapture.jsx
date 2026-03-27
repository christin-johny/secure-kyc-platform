import React, { useState, useRef } from 'react';
import { useCamera } from './useCamera';

const KycCapture = () => {
  const { stream, videoRef, error, startCamera, stopCamera } = useCamera();
  
  const [mode, setMode] = useState(null); 
  const [capturedImage, setCapturedImage] = useState(null);
  const [recordedVideo, setRecordedVideo] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const chunksRef = useRef([]);

  const handleStartImage = () => {
    setMode('image');
    setCapturedImage(null);
    startCamera(false); 
  };

  const handleStartVideo = () => {
    setMode('video');
    setRecordedVideo(null);
    startCamera(true); 
  };

  const captureImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const imageUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageUrl);
    stopCamera();
  };

  const startRecording = () => {
    if (!stream) return;
    setIsRecording(true);
    chunksRef.current = [];
    
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
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

  const handleSubmit = () => {
    if (mode === 'image' && !capturedImage) {
      alert("Validation Error: Please capture an image first.");
      return;
    }
    if (mode === 'video' && !recordedVideo) {
      alert("Validation Error: Please record a video first.");
      return;
    }
    
    alert("✨ Success! Identity Verification Package compiled. (Backend bucket upload missing)");
  };

  return (
    <div className="card card-wide">
      <h2 className="page-title">Identity Verification</h2>
      <p className="page-subtitle">Securely verify your identity using our browser hardware integration.</p>

      {error && <div className="alert-error">{error}</div>}

      <div className="kyc-controls">
        <button onClick={handleStartImage} className="btn btn-secondary">
          📷 Image Mode
        </button>
        <button onClick={handleStartVideo} className="btn btn-secondary">
          🎥 Video Mode
        </button>
      </div>

      {stream && (
        <div className="video-container">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted={mode === 'video'} 
            className="video-element"
          />
          
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '0', right: '0', display: 'flex', justifyContent: 'center' }}>
            {mode === 'image' && (
              <button onClick={captureImage} className="btn btn-primary" style={{ width: 'auto', borderRadius: '2rem', padding: '0.75rem 2.5rem', boxShadow: 'var(--shadow-lg)' }}>
                📸 Take Snapshot
              </button>
            )}
            
            {mode === 'video' && !isRecording && (
              <button onClick={startRecording} className="btn btn-danger" style={{ width: 'auto', borderRadius: '2rem', padding: '0.75rem 2.5rem', boxShadow: 'var(--shadow-lg)' }}>
                🔴 Start Recording
              </button>
            )}
            
             {mode === 'video' && isRecording && (
              <button onClick={stopRecording} className="btn btn-warning" style={{ width: 'auto', borderRadius: '2rem', padding: '0.75rem 2.5rem', boxShadow: 'var(--shadow-lg)' }}>
                ⏹ Finish Video
              </button>
            )}
          </div>
        </div>
      )}

      {capturedImage && mode === 'image' && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Final Snapshot</h3>
          <img src={capturedImage} alt="KYC Capture" className="capture-preview" />
        </div>
      )}

      {recordedVideo && mode === 'video' && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Final Video Verification</h3>
          <video src={recordedVideo} controls className="capture-preview" />
        </div>
      )}

      {(capturedImage || recordedVideo) && (
        <div style={{ marginTop: '2.5rem' }}>
          <button onClick={handleSubmit} className="btn btn-primary" style={{ padding: '1.25rem' }}>
            Submit Identity Verification
          </button>
        </div>
      )}
    </div>
  );
};

export default KycCapture;
