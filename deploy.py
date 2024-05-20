from flask import Flask, request, jsonify
import numpy as np
import os
import tensorflow as tf
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

model1 = tf.keras.models.load_model('real_estate_model_mobilenet_softmax.h5')

model2 = tf.keras.models.load_model('real_estate_model_mobilenet_2_sigmoid.h5')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image found'})

    image = request.files['image']
    
    
    image_path = "temp_image.jpg"
    image.save(image_path)
    
   
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(224, 224))
    
   
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  
    img_array /= 255.  
    

    probabilities1 = model1.predict(img_array)[0]
    
    probabilities2 = model2.predict(img_array)[0]

    relevant_classes = []
    for i in range(len(probabilities1)):
            relevant_classes.append(i)
    

    os.remove(image_path)
    return jsonify({'probabilities1': probabilities1.tolist(), 'probabilities2': probabilities2.tolist()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
