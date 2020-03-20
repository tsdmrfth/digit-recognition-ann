import io
import pathlib
import pickle
from os import path

from PIL import Image
from numpy import r_, asarray
from sklearn.datasets import load_digits


def get_train_data():
    train_data_path = get_train_data_path()

    if path.exists(train_data_path):
        with open(train_data_path, 'rb') as file:
            train_data = pickle.load(file)
    else:
        digits = load_digits()
        features = digits['data']
        targets = digits['target']
        train_data = {
            'features': features,
            'targets': targets
        }
        store_train_data(train_data)

    return train_data


def get_train_data_path():
    current_path = pathlib.Path(__file__).parent.absolute()
    return path.join(current_path, 'train_data.pickle')


def store_train_data(train_data):
    pickle.dump(train_data, open(get_train_data_path(), 'wb'))


def add_train_data(new_features, new_target):
    train_data = get_train_data()
    features = train_data['features']
    targets = train_data['targets']
    features = r_[features, new_features]
    targets = r_[targets, new_target]
    store_train_data({
        'features': features,
        'targets': targets
    })


async def get_data_from_image(image_file):
    image_data = await image_file.read()
    image = Image.open(io.BytesIO(image_data))
    return asarray(image)
