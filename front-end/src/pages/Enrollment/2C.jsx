import CameraCaptureComponent from './CameraCaptureComponent';
import instructionImage from '../../assets/imgs/photo_instructions.png';

function MyPage() {
    const handleCapture = (imageData) => {
        console.log('Captured image:', imageData);
        // Handle the captured image
    };

    return (
        <CameraCaptureComponent
            onCapture={handleCapture}
            instructionImage={instructionImage}
        />
    );
}

export default MyPage