import {GET_PREDICTION_ERROR, GET_PREDICTION_SUCCESS, MODEL_TRAINED} from "./types";

export const initialState = {
    error: '',
    prediction: null,
    isModelTrained: false,
}

export default (state, {type, payload}) => {
    switch (type) {
        case GET_PREDICTION_ERROR:
            return {...state, error: payload}
        case GET_PREDICTION_SUCCESS:
            return {...state, prediction: payload, error: ''}
        case MODEL_TRAINED:
            return {...state, isModelTrained: true}
        default:
            return state
    }
}