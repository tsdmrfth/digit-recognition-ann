import {
    FEEDBACK_SUBMIT_SUCCESS,
    GET_PREDICTION_ERROR,
    GET_PREDICTION_SUCCESS,
    MODEL_TRAINED,
    RESET_STATE
} from "./types";

export const initialState = {
    error: '',
    prediction: null,
    isModelTrained: false,
    percentage: null,
    isFeedbackSubmitSuccess: false,
}

export default (state, {type, payload}) => {
    switch (type) {
        case GET_PREDICTION_ERROR:
            return {...state, error: payload}
        case GET_PREDICTION_SUCCESS:
            const {prediction, percentage} = payload
            return {...state, prediction, percentage: percentage.toFixed(3), error: ''}
        case MODEL_TRAINED:
            return {...state, isModelTrained: true}
        case RESET_STATE:
            return {...state, prediction: null, percentage: null, isFeedbackSubmitSuccess: false}
        case FEEDBACK_SUBMIT_SUCCESS:
            return {...state, isFeedbackSubmitSuccess: true}
        default:
            return state
    }
}