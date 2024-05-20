import React, { useState } from 'react';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [probabilities1, setProbabilities1] = useState([]);
  const [probabilities2, setProbabilities2] = useState([]);
  const [highProbabilityClasses, setHighProbabilityClasses] = useState([]);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError('Please select an image.');
      return;
    }
    setImage(file);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.probabilities1 && data.probabilities2) {
        const roundedProbabilities1 = data.probabilities1.map(probability => parseFloat(probability).toFixed(4)); 
        const roundedProbabilities2 = data.probabilities2.map(probability => parseFloat(probability).toFixed(4)); 
        setProbabilities1(roundedProbabilities1);
        setProbabilities2(roundedProbabilities2);
        
        const highProbabilityClasses = [];
        for (let i = 0; i < roundedProbabilities1.length; i++) {
          if (roundedProbabilities1[i] > 0.7 && roundedProbabilities2[i] > 0.9) {
            if(i == 2 && roundedProbabilities1[i] >= 0.98 && roundedProbabilities2[i] >= 0.98){
              highProbabilityClasses.push(i);
            }else if (i !=2){
              highProbabilityClasses.push(i);
            }
          }
        }
        setHighProbabilityClasses(highProbabilityClasses);
      } else if (data.message) {
        setError(data.message);
        setProbabilities1([]);
        setProbabilities2([]);
        setHighProbabilityClasses([]);
      }
    })
    .catch(error => console.error('Error uploading image:', error));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white px-4">
      <div className="flex-grow flex flex-row">
        <div className="flex-grow flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-8">Real Estate Classification</h1>
          <p className="text-lg mb-8 max-w-lg text-center">
            This application classifies real estate images into different categories such as frontyard, backyard, kitchen, living room, bedroom, and bathroom.
          </p>
          <div className="flex flex-col items-center mb-8">
            <label htmlFor="upload" className="bg-white text-gray-900 px-6 py-3 rounded-md cursor-pointer">
              Choose an Image
            </label>
            <input
              id="upload"
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={handleImageChange}
              className="hidden"
            />
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
          {image && (
            <div className="max-w-lg mb-8">
              <img src={URL.createObjectURL(image)} alt="Uploaded" className="max-w-full rounded-md shadow-lg" />
            </div>
          )}
        </div>
        {(probabilities1.length > 0 && probabilities2.length > 0) && (
          <div className="flex-grow max-w-lg flex flex-col items-start pl-8 pt-4">
            <h2 className="text-2xl font-bold mb-4">Probabilities:</h2>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold">Softmax Results:</h3>
              <ul className="text-lg">
                {probabilities1.map((probability, index) => (
                  <li key={index} className="mb-2">{`${['Backyard', 'Bathroom', 'Bedroom', 'Frontyard', 'Kitchen', 'Living Room'][index]}: ${probability}`}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col mt-8">
              <h3 className="text-lg font-bold">Sigmoid Results:</h3>
              <ul className="text-lg">
                {probabilities2.map((probability, index) => (
                  <li key={index} className="mb-2">{`${['Backyard', 'Bathroom', 'Bedroom', 'Frontyard', 'Kitchen', 'Living Room'][index]}: ${probability}`}</li>
                ))}
              </ul>
            </div>
            <h2 className="text-2xl font-bold mt-8 mb-4">High Probability Classes:</h2>
            <div className="text-xl">
              {highProbabilityClasses.length > 0 ? (
                <p>
                  {highProbabilityClasses.map((index, i) => (
                    <span key={i} className="font-bold text-2xl">{['Backyard', 'Bathroom', 'Bedroom', 'Frontyard', 'Kitchen', 'Living Room'][index]}</span>
                  ))}
                </p>
              ) : (
                <p>No class with really high probability found.</p>
              )}
            </div>
            <p className="text-sm mt-4">
              Note: The highest probability corresponds to the most likely classification.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
