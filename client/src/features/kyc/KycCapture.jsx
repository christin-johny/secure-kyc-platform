import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KycAPI } from '../../common/services/apiClient';
import { useCamera } from './useCamera';
import toast from 'react-hot-toast';

const dataURLtoBlob = (dataurl) => {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
};

const KycCapture = () => {
  const { stream, videoRef, error, startCamera, stopCamera } = useCamera();
  const navigate = useNavigate();
  
  const [kycData, setKycData] = useState({ loading: true, data: null });
  const [mode, setMode] = useState(null); 
  const [capturedImage, setCapturedImage] = useState(null);
  
  const [recordedVideo, setRecordedVideo] = useState(null); 
  const [recordedVideoBlob, setRecordedVideoBlob] = useState(null); 
  
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const chunksRef = useRef([]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await KycAPI.getKycStatus();
        const user = res.data;
        if (user.kycImageKey || user.kycVideoKey) {
          setKycData({ loading: false, data: user });
        } else {
          setKycData({ loading: false, data: null });
        }
      } catch (err) {
        setKycData({ loading: false, data: null });
      }
    };
    fetchMe();
  }, []);

  const handleStartImage = () => {
    setMode('image');
    setCapturedImage(null);
    startCamera(false); 
  };

  const handleStartVideo = () => {
    setMode('video');
    setRecordedVideo(null);
    setRecordedVideoBlob(null);
    startCamera(true); 
  };

  const captureImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    setCapturedImage(canvas.toDataURL('image/jpeg'));
    toast.success('Snapshot successfully captured!');
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
      setRecordedVideoBlob(blob); 
      setRecordedVideo(URL.createObjectURL(blob)); 
      setIsRecording(false);
      toast.success('Video recording finalized!');
    };
    mediaRecorderRef.current.start();
    toast('Recording Started. Speak clearly.', { icon: '🎤' });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      stopCamera();
    }
  };

  const handleSubmit = async () => {
    if (mode === 'image' && !capturedImage) {
      toast.error('Please capture an image first.');
      return;
    }
    if (mode === 'video' && !recordedVideoBlob) {
      toast.error('Please record a video first.');
      return;
    }
    
    setIsUploading(true);
    const loadingToast = toast.loading('Encrypting and uploading to AWS S3...');
    
    try {
      const formData = new FormData();
      
      if (mode === 'image') {
        const imageBlob = dataURLtoBlob(capturedImage);
        formData.append('image', imageBlob, 'kyc-photo.jpg');
      }
      if (mode === 'video') {
        formData.append('video', recordedVideoBlob, 'kyc-video.webm');
      }

      await KycAPI.uploadBiometrics(formData);
      
      toast.success("Identity verified and archived securely!", { id: loadingToast });
      navigate('/dashboard'); 
    } catch (err) {
      console.error(err);
      toast.error("Error securely uploading files to Cloud.", { id: loadingToast });
    }
    setIsUploading(false);
  };

  if (kycData.loading) {
    return <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-12 w-full max-w-4xl mx-auto shadow-2xl text-center text-slate-400 font-medium">Securely polling your identity profile...</div>;
  }

  if (kycData.data) {
    const { kycImageUrl, kycVideoUrl } = kycData.data;
    return (
      <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-8 md:p-12 w-full max-w-4xl mx-auto shadow-2xl text-center">
        <div className="text-6xl mb-4">🛡️</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-white">Identity Securely Verified</h2>
        <p className="text-emerald-500 text-lg mb-2 font-medium">
          Your Identity Artifacts have been encrypted to our AWS S3 Cloud.
        </p>
        <p className="text-slate-400">No further biometrics are required.</p>
        
        <div className="flex flex-wrap gap-8 justify-center mt-12">
          {kycImageUrl && (
             <div className="flex-1 min-w-[300px]">
               <h3 className="text-lg font-semibold text-slate-200 mb-4">Archived Photo ID</h3>
               <img src={kycImageUrl} alt="KYC Proof" className="w-full rounded-2xl border-2 border-slate-700 shadow-xl" />
             </div>
          )}
          {kycVideoUrl && (
             <div className="flex-1 min-w-[300px]">
               <h3 className="text-lg font-semibold text-slate-200 mb-4">Archived Video Assertion</h3>
               <video src={kycVideoUrl} controls className="w-full rounded-2xl border-2 border-slate-700 shadow-xl" />
             </div>
          )}
        </div>
        
        <div className="mt-12">
          <button 
            onClick={() => setKycData({ ...kycData, data: null })} 
            className="inline-flex items-center justify-center px-8 py-3 bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600 text-white rounded-xl font-medium transition-all"
          >
            🔄 Retake Identity Verification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-8 md:p-12 w-full max-w-4xl mx-auto shadow-2xl">
      <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-center">Identity Verification</h2>
      <p className="text-slate-400 mb-8 leading-relaxed text-center">Securely verify your identity using our browser hardware integration.</p>

      {error && <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 rounded-md mb-6">{error}</div>}

      <div className="flex gap-4 justify-center mt-8">
        <button onClick={handleStartImage} className="inline-flex items-center justify-center px-6 py-3 bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600 text-white rounded-xl font-medium transition-all">
          📷 Image Mode
        </button>
        <button onClick={handleStartVideo} className="inline-flex items-center justify-center px-6 py-3 bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600 text-white rounded-xl font-medium transition-all">
          🎥 Video Mode
        </button>
      </div>

      {stream && (
        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative mt-8 border border-slate-700 shadow-2xl">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted={mode === 'video'} 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            {mode === 'image' && (
              <button onClick={captureImage} className="inline-flex items-center justify-center px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow-[0_10px_25px_rgba(99,102,241,0.5)] hover:-translate-y-1 transition-all">
                📸 Take Snapshot
              </button>
            )}
            
            {mode === 'video' && !isRecording && (
              <button onClick={startRecording} className="inline-flex items-center justify-center px-10 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow-[0_10px_25px_rgba(220,38,38,0.5)] hover:-translate-y-1 transition-all">
                🔴 Start Recording
              </button>
            )}
            
             {mode === 'video' && isRecording && (
              <button onClick={stopRecording} className="inline-flex items-center justify-center px-10 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-semibold shadow-[0_10px_25px_rgba(245,158,11,0.5)] hover:-translate-y-1 transition-all animate-pulse">
                ⏹ Finish Video
              </button>
            )}
          </div>
        </div>
      )}

      {capturedImage && mode === 'image' && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-3">Final Snapshot</h3>
          <img src={capturedImage} alt="KYC Capture" className="w-full rounded-2xl border border-slate-700 shadow-xl" />
        </div>
      )}

      {recordedVideo && mode === 'video' && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-3">Final Video Verification</h3>
          <video src={recordedVideo} controls className="w-full rounded-2xl border border-slate-700 shadow-xl" />
        </div>
      )}

      {(capturedImage || recordedVideoBlob) && (
        <div className="mt-10">
          <button 
            onClick={handleSubmit} 
            className={`inline-flex items-center justify-center w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${isUploading ? 'bg-indigo-600/50 text-white/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5'}`} 
            disabled={isUploading}
          >
            {isUploading ? 'Encrypting securely to AWS S3...' : 'Submit Identity Verification to Cloud'}
          </button>
        </div>
      )}
    </div>
  );
};

export default KycCapture;
