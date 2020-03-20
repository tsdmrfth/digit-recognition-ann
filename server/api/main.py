from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from server.model.data.data_manager import get_train_data, get_data_from_image
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
    train_data = get_train_data()
    features = train_data['features']
    targets = train_data['targets']
    model.fit(features, targets)
    return 'done'


@app.post('/prediction')
async def get_prediction(digit_file: UploadFile = File(...)):
    status_code = 200

    if model.is_trained:
        data = await get_data_from_image(digit_file)
        prediction, percentage = model.predict(data.reshape(64))
        response_content = {
            'prediction': prediction,
            'percentage': percentage
        }
    else:
        response_content = {'error': 'Model is not trained. Training model...'}
        status_code = 403

    return JSONResponse(content=response_content, status_code=status_code)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=5000, log_level="info", reload=True, debug=True)
