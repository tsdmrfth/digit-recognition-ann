import {getAxiosClient} from "../getAxiosClient";
import {GET_PREDICTION_ERROR, GET_PREDICTION_SUCCESS} from "./types";

export const getPredictionForDrawing = dispatch => async drawing => {
    const data = new FormData();
    data.append('digit_file', drawing)
    const response = await getAxiosClient().post('http://127.0.0.1:5000/prediction', data)

    if (response.status === 200) {
        dispatch({type: GET_PREDICTION_SUCCESS, payload: response.data.prediction})
    } else {
        dispatch({type: GET_PREDICTION_ERROR, payload: response.data.error})
        await getAxiosClient().post('http://127.0.0.1:5000/train')
        getPredictionForDrawing(drawing)
    }
}