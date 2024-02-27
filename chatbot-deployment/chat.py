import random
import json

import torch

from model import NeuralNet
from nltk_utils import bag_of_words, tokenize
import requests
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open('intents.json', 'r') as json_data:
    intents = json.load(json_data)

FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

bot_name = "Greek"
API_KEY='cc4accb8ab804fb790395713231806'
def get_weather(city):
    try:
        # Replace 'YOUR_API_KEY' with your actual WeatherAPI.com API key
        url = f"http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={city}"

        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        if 'current' in data:
            current_weather = data['current']

            # Extract the relevant weather information
            weather_description = current_weather['condition']['text']
            temperature = current_weather['temp_c']
            humidity = current_weather['humidity']

            # Create the weather report
            report = f"The weather in {city} is {weather_description}. "
            report += f"The temperature is {temperature} degrees Celsius. "
            report += f"The humidity is {humidity}%."

            return report
        else:
            print("Error: Failed to retrieve weather information.")
            return None
    except requests.exceptions.RequestException as e:
        print("Error retrieving weather information:", e)
        return None

def get_response(msg):
    #weather key--check
    if "weather" in msg.lower():
        city = msg.split()[-1]
        return get_weather(city)
    
    sentence = tokenize(msg)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.80: ###accuracy!!!
        for intent in intents['intents']:
            if tag == intent["tag"]:
                return random.choice(intent['responses'])
    
    return "I do not understand..."


if __name__ == "__main__":
    print("Let's chat! (type 'quit' to exit)")
    while True:
        sentence = "do you use credit cards?"
        sentence = input("You: ")
        if sentence == "quit":
            break

        resp = get_response(sentence)
        print(resp)

