## Setting up Project

1. Start the frontend with npm start on localhost.
2. Start the backend using python deploy.py

## Working of Project

The React frontend asks for an image from the user. After it has successfully loaded, a call to the backend endpoint is made. Two H5 files (containing the model details) are loaded. One contains the model with the softmax function and one contains the model trained with the sigmoid function in the last output layer. Both make their predictions and the results are displayed on the screen. According to what threshold we want to keep e.g. a prediction of above 95% from both models will result in a class being predicted as positive, the results can be manipulated. 

## Softmax and Sigmoid functions

### Sigmoid Function
A sigmoid function gives the probabilities independently of each other. It could predict 1.0 for both living room or bedroom at once.

### Softmax Function
A softmax function relates all probabilities together. If a certain class is 0.97, the remaining class probabilities have to sum to 0.03.

## Reason of using both functions

A softmax function tries to fit images that are not real estate into a certain classification as well, as the sum as to be equal to 1 in any case. Sigmoid does not have this restriction. However, a sigmoid function may give 2-3 predictions with high probability values and to shortlist the most likely one we can then also get the top prediction from softmax and compare whether it is also a high prediction by the sigmoid function.

![Screenshot 2024-04-29 171208](https://github.com/dark-coder12/real-estate-react/assets/82564549/9e632d6f-909a-45c1-9154-3148fa92880f)

![Screenshot 2024-04-29 171142](https://github.com/dark-coder12/real-estate-react/assets/82564549/e2740737-85c6-4715-ad5d-5457248ba2f2)


