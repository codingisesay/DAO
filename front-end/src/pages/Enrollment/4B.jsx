import React, { useRef, useState } from 'react';
import io from 'socket.io-client';

// const SIGNALING_SERVER_URL = 'https://172.16.1.223:5000'; // Update as needed

const API_BASE_URL = import.meta.env.VITE_BASE_URL_LOGIN;

const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL;

const VideoKYC = () => {
  const token = new URLSearchParams(window.location.search).get('token');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const canvasRef = useRef(null);

  const [callStarted, setCallStarted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [recorder, setRecorder] = useState(null);
  const [pipPos, setPipPos] = useState({ x: 420, y: 300 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Store these outside state to avoid re-renders
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(new window.MediaStream());
  const recordedChunksRef = useRef([]);

  // Drawing function for PiP
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (remoteVideoRef.current && remoteVideoRef.current.readyState >= 2) {
      ctx.drawImage(remoteVideoRef.current, 0, 0, canvas.width, canvas.height);
    }
    if (localVideoRef.current && localVideoRef.current.readyState >= 2) {
      ctx.drawImage(localVideoRef.current, canvas.width - 180, canvas.height - 140, 160, 120);
    }
    if (!callEnded) requestAnimationFrame(draw);
  };

  // Upload video blob to backend
  const uploadVideo = async (blob) => {
    const formData = new FormData();
    formData.append('video', blob);
    formData.append('token', token);
    try {
      setStatus('Uploading...');
      const res = await fetch(`${API_BASE_URL}/video-kyc/upload`, {
      method: 'POST',
      body: formData,
     });
      const data = await res.json();
      if (data.success) {
        setStatus('Video uploaded and session updated!');
        alert('Video uploaded and session updated!');
      } else {
        setStatus('Upload failed!');
        alert('Upload failed!');
      }
    } catch (err) {
      setStatus('Upload error');
      alert('Upload error: ' + err.message);
    }
    setRecording(false);
  };

  // Start the call
  const startCall = async () => {
    setStatus('Requesting camera/mic...');
    try {
      // 1. Get local media
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = localStream;
      localVideoRef.current.srcObject = localStream;

      // 2. Connect to signaling server
      socketRef.current = io(SIGNALING_SERVER_URL, { transports: ['websocket'] });
      socketRef.current.emit('join', token);

      // 3. Setup PeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      peerConnectionRef.current = pc;

      // Add local tracks
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

      // Handle remote tracks
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => remoteStreamRef.current.addTrack(track));
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      };

      // ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('signal', {
            roomId: token,
            data: { type: 'candidate', candidate: event.candidate }
          });
        }
      };

      // Signaling
      socketRef.current.on('signal', async ({ data }) => {
        if (data.type === 'offer') {
          await pc.setRemoteDescription(new window.RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socketRef.current.emit('signal', {
            roomId: token,
            data: { type: 'answer', answer }
          });
        } else if (data.type === 'answer') {
          await pc.setRemoteDescription(new window.RTCSessionDescription(data.answer));
        } else if (data.type === 'candidate') {
          try {
            await pc.addIceCandidate(new window.RTCIceCandidate(data.candidate));
          } catch (e) {}
        }
      });

      // When another user joins, create and send offer
      socketRef.current.on('user-joined', async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current.emit('signal', {
          roomId: token,
          data: { type: 'offer', offer }
        });
      });

      // Start drawing PiP
      const canvas = canvasRef.current;
      canvas.width = 640;
      canvas.height = 480;
      setCallEnded(false);
      draw();

      setCallStarted(true);
      setStatus('Call Started');
    } catch (err) {
      setStatus('Camera/Mic error: ' + err.message);
      alert('Camera/Mic error: ' + err.message);
    }
  };

  // End the call and upload video if recording
  const endCall = () => {
    setStatus('Call Ended');
    setCallStarted(false);
    setCallEnded(true);

    // Stop all media tracks
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    remoteStreamRef.current?.getTracks().forEach(track => track.stop());

    // Close peer connection
    peerConnectionRef.current?.close();

    // Disconnect socket
    socketRef.current?.disconnect();

    // Clear video elements
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    // If recording, stop and upload
    if (recorder && recording) {
      recorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        await uploadVideo(blob);
      };
      recorder.stop();
      setStatus('Uploading...');
    } else {
      // If not recording, capture a short video (1s) and upload
      const canvas = canvasRef.current;
      const mixedStream = canvas.captureStream();
      const tempRecorder = new window.MediaRecorder(mixedStream);
      let tempChunks = [];
      tempRecorder.ondataavailable = (e) => tempChunks.push(e.data);
      tempRecorder.onstop = async () => {
        const blob = new Blob(tempChunks, { type: 'video/webm' });
        await uploadVideo(blob);
      };
      tempRecorder.start();
      setTimeout(() => tempRecorder.stop(), 1000); // record 1s
      setStatus('Uploading...');
    }
  };

  // Start recording
  const startRecording = () => {
    const canvas = canvasRef.current;
    const mixedStream = canvas.captureStream();
    const mediaRecorder = new window.MediaRecorder(mixedStream);
    recordedChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => recordedChunksRef.current.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      await uploadVideo(blob);
    };

    mediaRecorder.start();
    setRecorder(mediaRecorder);
    setRecording(true);
    setStatus('Recording...');
  };

  // Stop recording and upload
  const stopRecording = () => {
    if (recorder) {
      recorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        await uploadVideo(blob);
      };
      recorder.stop();
      setStatus('Uploading...');
    }
  };

  // PiP drag handlers
  const onPipMouseDown = (e) => {
    setDragging(true);
    setDragOffset({
      x: e.clientX - pipPos.x,
      y: e.clientY - pipPos.y
    });
  };
  const onPipMouseMove = (e) => {
    if (dragging) {
      setPipPos({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };
  const onPipMouseUp = () => setDragging(false);

  // Cleanup on unmount
  React.useEffect(() => {
    window.addEventListener('mousemove', onPipMouseMove);
    window.addEventListener('mouseup', onPipMouseUp);
    return () => {
      window.removeEventListener('mousemove', onPipMouseMove);
      window.removeEventListener('mouseup', onPipMouseUp);
      socketRef.current?.disconnect();
      peerConnectionRef.current?.close();
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      remoteStreamRef.current?.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line
  }, [dragging, dragOffset]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <h2 style={{ margin: '30px 0 10px 0', color: '#2d3a4b', fontWeight: 700 }}>Video KYC</h2>
      <div style={{
        position: 'relative',
        width: 640,
        height: 480,
        background: '#222',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(60,60,120,0.18)',
        overflow: 'hidden'
      }}>
        {/* Status badge */}
        <div style={{
          position: 'absolute', top: 16, left: 16, zIndex: 10,
          background: status === 'Recording...' ? '#e74c3c' : '#3498db',
          color: '#fff', padding: '6px 18px', borderRadius: 12, fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          {status}
        </div>
        {/* Remote video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            background: '#000'
          }}
        />
        {/* PiP local video */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: 160,
            height: 120,
            position: 'absolute',
            left: pipPos.x,
            top: pipPos.y,
            borderRadius: 16,
            border: '3px solid #fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            cursor: 'grab',
            zIndex: 20,
            background: '#222',
            transition: 'box-shadow 0.2s'
          }}
          onMouseDown={onPipMouseDown}
        />
        {/* Hidden canvas for recording */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {/* Control bar */}
        <div style={{
          position: 'absolute',
          bottom: 18,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 18,
          zIndex: 30
        }}>
          {!callStarted && !callEnded && (
            <button onClick={startCall} style={btnStyle('#27ae60')}>Start Call</button>
          )}
          {callStarted && (
            <button onClick={endCall} style={btnStyle('#e67e22')}>End Call</button>
          )}
          {callStarted && !recording && (
            <button onClick={startRecording} style={btnStyle('#2980b9')}>Start Recording</button>
          )}
          {callStarted && recording && (
            <button onClick={stopRecording} style={btnStyle('#c0392b')}>End & Upload Recording</button>
          )}
        </div>
      </div>
      <div style={{ marginTop: 30, color: '#888', fontSize: 15 }}>
        <span>Powered by Payvance DAO</span>
      </div>
    </div>
  );
};

// Button style helper
function btnStyle(bg) {
  return {
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '12px 28px',
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'background 0.2s, box-shadow 0.2s'
  };
}

export default VideoKYC;