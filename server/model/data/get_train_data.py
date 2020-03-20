import pathlib
import pickle
from os import path

from sklearn.datasets import load_digits


def get_train_data():
    current_path = pathlib.Path(__file__).parent.absolute()
    train_data_path = path.join(current_path, 'train_data.pickle')

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
        pickle.dump(train_data, open(train_data_path, 'wb'))

    return train_data
