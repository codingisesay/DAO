import React, { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';

const VideoKYC = () => {
  const token = new URLSearchParams(window.location.search).get('token');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let localStream;
    let remoteStream;

    const draw = () => {
      if (remoteVideoRef.current?.readyState >= 2) {
        ctx.drawImage(remoteVideoRef.current, 0, 0, canvas.width, canvas.height);
      }
      if (localVideoRef.current?.readyState >= 2) {
        ctx.drawImage(localVideoRef.current, canvas.width - 200, canvas.height - 150, 200, 150);
      }
      requestAnimationFrame(draw);
    };

    async function setup() {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = localStream;

      const callFrame = DailyIframe.createFrame({
        showLeaveButton: true,
        iframeStyle: {
          width: '100%',
          height: '400px',
          border: '1px solid #ccc',
        },
      });

      callFrame.join({ url: `https://your-daily-subdomain.daily.co/${token}` });

      callFrame.on('track-started', (e) => {
        if (e.track.kind === 'video') {
          remoteStream = new MediaStream([e.track]);
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      document.getElementById('daily-container').appendChild(callFrame.iframe());

      canvas.width = 640;
      canvas.height = 480;
      draw();

      const mixedStream = canvas.captureStream();
      const mediaRecorder = new MediaRecorder(mixedStream);
      const recordedChunks = [];

      mediaRecorder.ondataavailable = (e) => recordedChunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('video', blob);
        formData.append('token', token);
        await fetch('/api/video-kyc/upload', {
          method: 'POST',
          body: formData,
        });
        alert('Video uploaded');
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
    }

    setup();
  }, [token]);

  const stopRecording = () => {
    recorder?.stop();
  };

  return (
    <div>
      <h2>Video KYC</h2>
      <video ref={remoteVideoRef} autoPlay style={{ width: '100%' }} />
      <video ref={localVideoRef} autoPlay muted style={{ width: '200px', position: 'absolute', bottom: 20, right: 20, border: '2px solid red' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div>
        <button onClick={stopRecording}>⏹ End & Upload</button>
      </div>
      <div id="daily-container" style={{ display: 'none' }} />
    </div>
  );
};

export default VideoKYC;
