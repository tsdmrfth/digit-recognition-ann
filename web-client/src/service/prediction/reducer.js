import {GET_PREDICTION_ERROR, GET_PREDICTION_SUCCESS} from "./types";

export const initialState = {
    error: '',
    prediction: null
}

export default (state, {type, payload}) => {
    switch (type) {
        case GET_PREDICTION_ERROR:
            return {...state, error: payload}
        case GET_PREDICTION_SUCCESS:
            return {...state, prediction: payload, error: ''}
        default:
            return state
    }
}