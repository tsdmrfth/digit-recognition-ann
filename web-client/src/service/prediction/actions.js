import {getAxiosClient} from "../getAxiosClient";
import {GET_PREDICTION_ERROR, GET_PREDICTION_SUCCESS, MODEL_TRAINED, RESET_STATE} from "./types";

export const getPredictionForDrawing = dispatch => async drawing => {
    const formData = new FormData();
    formData.append('digit_file', drawing)
    const {
        status,
        data: {
            error,
            prediction,
            percentage
        }
    } = await getAxiosClient().post('http://127.0.0.1:5000/prediction', formData)

    if (status === 200) {
        dispatch({type: GET_PREDICTION_SUCCESS, payload: {prediction, percentage}})
    } else {
        dispatch({type: GET_PREDICTION_ERROR, payload: error})
        await getAxiosClient().post('http://127.0.0.1:5000/train')
        dispatch({type: MODEL_TRAINED})
        getPredictionForDrawing(dispatch)(drawing)
    }
}

export const resetState = dispatch => dispatch({type: RESET_STATE})