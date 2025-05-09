
const PhotoCapture = () => {

    return (
        <div className="photo-capture">

            <h2 className="text-xl font-bold mb-2">Photo Capture</h2>

        </div>
    );
};

export default PhotoCapture;





// import { useState, useRef, useCallback } from 'react';
// import Webcam from 'react-webcam';
// import RecordRTC from 'recordrtc';

// const LivePhotoCapture = () => {
//     const [isRecording, setIsRecording] = useState(false);
//     const [recordedVideo, setRecordedVideo] = useState(null);
//     const [devices, setDevices] = useState([]);
//     const [selectedDevice, setSelectedDevice] = useState('');
//     const [duration, setDuration] = useState(3); // default 3 seconds

//     const webcamRef = useRef(null);
//     const mediaRecorderRef = useRef(null);
//     const recordedVideoRef = useRef(null);

//     const handleDevices = useCallback((mediaDevices) => {
//         const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput');
//         setDevices(videoDevices);
//         if (videoDevices.length > 0) {
//             setSelectedDevice(videoDevices[0].deviceId);
//         }
//     }, []);

//     const startRecording = () => {
//         setIsRecording(true);
//         setRecordedVideo(null);

//         const stream = webcamRef.current.video.srcObject;
//         mediaRecorderRef.current = new RecordRTC(stream, {
//             type: 'video',
//             mimeType: 'video/webm',
//             timeSlice: 1000, // 1 second intervals for live preview
//             ondataavailable: (blob) => {
//                 // You could use this for live preview if needed
//             },
//         });

//         mediaRecorderRef.current.startRecording();

//         // Stop recording after the specified duration
//         setTimeout(() => {
//             stopRecording();
//         }, duration * 1000);
//     };

//     const stopRecording = () => {
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stopRecording(() => {
//                 const blob = mediaRecorderRef.current.getBlob();
//                 setRecordedVideo(URL.createObjectURL(blob));
//                 setIsRecording(false);
//             });
//         }
//     };

//     const downloadVideo = () => {
//         if (recordedVideo) {
//             const a = document.createElement('a');
//             a.href = recordedVideo;
//             a.download = 'live-photo.webm';
//             a.click();
//         }
//     };

//     return (
//         <div className="live-photo-capture">
//             <h1>Live Photo Capture</h1>

//             <div className="controls">
//                 <div>
//                     <label>Duration (seconds): </label>
//                     <input
//                         type="number"
//                         min="1"
//                         max="10"
//                         value={duration}
//                         onChange={(e) => setDuration(Math.min(10, Math.max(1, e.target.value)))}
//                     />
//                 </div>

//                 <div>
//                     <label>Camera: </label>
//                     <select
//                         value={selectedDevice}
//                         onChange={(e) => setSelectedDevice(e.target.value)}
//                     >
//                         {devices.map((device) => (
//                             <option key={device.deviceId} value={device.deviceId}>
//                                 {device.label || `Camera ${device.deviceId}`}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>

//             <div className="camera-container" style={{ width: '200px' }}>
//                 <Webcam
//                     audio={false}
//                     ref={webcamRef}
//                     videoConstraints={{
//                         deviceId: selectedDevice,
//                     }}
//                     onUserMedia={() => {
//                         navigator.mediaDevices.enumerateDevices().then(handleDevices);
//                     }}
//                 />
//             </div>

//             <div className="buttons">
//                 {!isRecording ? (
//                     <button onClick={startRecording} disabled={!selectedDevice}>
//                         Start Recording ({duration}s)
//                     </button>
//                 ) : (
//                     <button onClick={stopRecording}>Stop Recording</button>
//                 )}

//                 {recordedVideo && (
//                     <>
//                         <button onClick={downloadVideo}>Download Live Photo</button>
//                         <div className="preview" style={{ width: '200px' }}>
//                             <h3>Preview:</h3>
//                             <video
//                                 ref={recordedVideoRef}
//                                 src={recordedVideo}
//                                 controls
//                                 autoPlay
//                                 loop
//                             />
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default LivePhotoCapture;