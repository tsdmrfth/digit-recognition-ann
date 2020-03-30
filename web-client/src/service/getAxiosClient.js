import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/'
export const getAxiosClient = () => axios.create({
    baseURL,
    withCredentials: true,
    validateStatus: () => true
})