from flask import Flask, request, jsonify
import torch
from transformers import BertTokenizer, BertModel
import pickle
from model import NeuralNet  # Assuming the model is in a file called model.py

app = Flask(__name__)

# Load the PyTorch model from the pickle file
with open('model.pkl', 'rb') as f:
    loaded_model = pickle.load(f)

# Load other necessary data (replace with the actual data loading logic)
with open('data.pth', 'rb') as f:
    data = torch.load(f)
    tags = data['tags']

# Load the pre-trained BERT tokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        input_text = data['input_text']

        # Tokenize input text using BERT tokenizer
        tokens = tokenizer.encode(input_text, add_special_tokens=True)

        # Convert tokens to a PyTorch tensor
        input_tensor = torch.tensor(tokens).view(1, -1)

        # Make the prediction
        with torch.no_grad():
            output = loaded_model(input_tensor)

        # Get the predicted class index
        _, predicted_class = torch.max(output, 1)

        # Get the corresponding tag
        predicted_tag = tags[predicted_class.item()]

        # Create a response dictionary
        response = {'predicted_tag': predicted_tag, 'success': True}

        return jsonify(response)

    except Exception as e:
        print(e)
        response = {'error': 'Invalid input', 'success': False}
        return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
