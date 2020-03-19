from fastapi import FastAPI
from sklearn.datasets import load_digits

from server.model.digit_recognizer import DigitRecognizerNN

app = FastAPI()

model = DigitRecognizerNN()


@app.get('/')
def root():
    return 'Machines should work, people should think.'


@app.post('/train-model')
def train_model():
    digits = load_digits()
    features = digits['data']
    targets = digits['target']
    model.fit(features, targets)
    return 'done'


@app.get('/prediction')
def get_prediction():
    pass
