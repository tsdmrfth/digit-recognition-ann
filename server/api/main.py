import io

from PIL import Image
from fastapi import FastAPI, UploadFile, File
from numpy import asarray
from sklearn.datasets import load_digits
from starlette.responses import JSONResponse

from server.model.digit_recognizer import DigitRecognizerNN

app = FastAPI()

model = DigitRecognizerNN()


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


@app.get('/prediction')
async def get_prediction(digit_file: UploadFile = File(...)):
    if model.is_trained:
        image_data = await digit_file.read()
        image = Image.open(io.BytesIO(image_data))
        data = asarray(image)
        return int(model.predict(data[0:, 0:8, :1].reshape(64)))
    else:
        return JSONResponse(content={'error': 'Model should be trained.'}, status_code=401)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=5000, log_level="info", reload=True, debug=True)
