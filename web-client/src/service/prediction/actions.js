import {getAxiosClient} from "../getAxiosClient";
import {
    FEEDBACK_SUBMIT_SUCCESS,
    GET_PREDICTION_ERROR,
    GET_PREDICTION_SUCCESS,
    MODEL_TRAINED,
    RESET_STATE
} from "./types";
import urls from "../../../assets/urls";

export const getPredictionForDrawing = dispatch => async drawing => {
    const formData = new FormData()
    formData.append('digit_file', drawing)
    const {
        status,
        data: {
            error,
            prediction,
            percentage
        }
    } = await getAxiosClient().post(urls.prediction, formData)

    if (status === 200) {
        dispatch({type: GET_PREDICTION_SUCCESS, payload: {prediction, percentage}})
    } else {
        dispatch({type: GET_PREDICTION_ERROR, payload: error})
        await getAxiosClient().post(urls.train)
        dispatch({type: MODEL_TRAINED})
        getPredictionForDrawing(dispatch)(drawing)
    }
}

export const resetState = dispatch => dispatch({type: RESET_STATE})

export const setActualValueForDrawing = dispatch => async (drawing, actualValue) => {
    const formData = new FormData()
    formData.append('data', drawing, actualValue)
    await getAxiosClient().put(urls.addTrainData, formData)
    dispatch({type: FEEDBACK_SUBMIT_SUCCESS})
}