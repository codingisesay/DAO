import React, { useRef, useState } from 'react';
import io from 'socket.io-client';

const SIGNALING_SERVER_URL = 'https://172.16.1.223:5000'; // Use https if your signaling server is https

const VideoKYC = () => {
  const token = new URLSearchParams(window.location.search).get('token');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const canvasRef = useRef(null);

  const [callStarted, setCallStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [recorder, setRecorder] = useState(null);

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
      ctx.drawImage(localVideoRef.current, canvas.width - 200, canvas.height - 150, 200, 150);
    }
    requestAnimationFrame(draw);
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
        // Only the second user to join will trigger this
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
      draw();

      setCallStarted(true);
      setStatus('Call Started');
    } catch (err) {
      setStatus('Camera/Mic error: ' + err.message);
      alert('Camera/Mic error: ' + err.message);
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
      const formData = new FormData();
      formData.append('video', blob);
      formData.append('token', token);
      await fetch('/api/video-kyc/upload', {
        method: 'POST',
        body: formData,
      });
      alert('Video uploaded');
      setRecording(false);
      setStatus('Call Started');
    };

    mediaRecorder.start();
    setRecorder(mediaRecorder);
    setRecording(true);
    setStatus('Recording...');
  };

  // Stop recording
  const stopRecording = () => {
    recorder?.stop();
    setStatus('Uploading...');
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      peerConnectionRef.current?.close();
      localStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div>
      <h2>Video KYC</h2>
      <div style={{ position: 'relative', width: 640, height: 480 }}>
        <video ref={remoteVideoRef} autoPlay style={{ width: '100%', background: '#000' }} />
        <video ref={localVideoRef} autoPlay muted style={{
          width: 200, position: 'absolute', bottom: 20, right: 20, border: '2px solid red'
        }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      <div style={{ marginTop: 20 }}>
        {!callStarted && (
          <button onClick={startCall}>Start Call</button>
        )}
        {callStarted && !recording && (
          <button onClick={startRecording}>Start Recording</button>
        )}
        {recording && (
          <button onClick={stopRecording}>End & Upload Recording</button>
        )}
      </div>
      <div style={{ marginTop: 10 }}>
        <b>Status:</b> {status}
      </div>
    </div>
  );
};

export default VideoKYC;