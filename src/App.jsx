import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import './App.css';
import swap from './assets/phone.png';
import gallery from './assets/gallery.png';

const App = () => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cameramode, setCameraMode] = useState('environment'); // Corrected useState initialization
  const [dimension, setDimension] = useState({ width: 400, height: 700 });


  console.log(dimension)

  // Function to change camera mode between front and back
  const changeCam = () => {
    setCameraMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  useEffect(() => {
    const updateDimensions = () => {
      const aspectRatio = window.innerWidth / window.innerHeight;
      const height = window.innerHeight;
      const width = height * aspectRatio; // Maintain aspect ratio
      setDimension({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const videoConstraints = {
    width: dimension.width,
    height: dimension.height,
    facingMode: 'user',
  };

  // Function to capture and send the image
  const captureAndSend = useCallback(async () => {
    setLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      setError('');
      const formData = new FormData();
      formData.append('photo', imageSrc);

      try {
        // Replace 'YOUR_API_URL' with your actual API endpoint
        const response = await fetch('YOUR_API_URL', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setSuccessMessage('Photo sent successfully!');
          console.log('Photo sent successfully!');
        } else {
          setError(`Failed to send photo: ${response.statusText}`);
          console.error('Failed to send photo:', response.statusText);
        }
      } catch (error) {
        setError('Error sending photo. Please try again.');
        console.error('Error sending photo:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setError('No image captured. Please try again.');
    }
  }, []);

  return (
    <div className='camera-main-container'>
      <div className='camera-card'>
      <div className='web-cam'>
      <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}

          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>
        <div className='btn-container'>
          <button className='side-btn' onClick={changeCam}>
            <img className='swap-icon' src={swap} alt='Switch Camera' width='30px' />
          </button>

          <button className='main-btn' onClick={captureAndSend} disabled={loading}>
            <div className='shutter-btn'></div>
          </button>

          <input
            className="file-input"
            type="file"
            id="hiddenFileInput"
            style={{ display: 'none' }}
          />
          <button
            className="side-btn"
            onClick={() => document.getElementById('hiddenFileInput').click()}
          >
            <img className='swap-icon' src={gallery} alt='Upload from Gallery' width='30px' />
          </button>
        </div>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default App;