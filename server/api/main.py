import io

from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from numpy import asarray
from sklearn.datasets import load_digits
from starlette.responses import JSONResponse

from server.model.digit_recognizer import DigitRecognizerNN

app = FastAPI()

model = DigitRecognizerNN()

origins = [
    'http://192.168.1.100:19006'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def root():
    return 'Machines should work, people should think.'


@app.post('/train')
def train_model():
    digits = load_digits()
    features = digits['data']
    targets = digits['target']
    model.fit(features, targets)
    return 'done'


@app.post('/prediction')
async def get_prediction(digit_file: UploadFile = File(...)):
    status_code = 200

    if model.is_trained:
        image_data = await digit_file.read()
        image = Image.open(io.BytesIO(image_data))
        data = asarray(image)
        prediction = int(model.predict(data[0:, 0:8, :1].reshape(64)))
        response_content = {'prediction': prediction}
    else:
        response_content = {'error': 'Model should be trained. Training...'}
        status_code = 403

    return JSONResponse(content=response_content, status_code=status_code)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=5000, log_level="info", reload=True, debug=True)
