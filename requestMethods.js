import axios from 'axios';
import { API_URL_V1, API_URL_V2 } from './helpers/constants';
const BASE_URL = API_URL_V1
const BASE_URL_V2 = API_URL_V2

if (typeof window !== "undefined") {
    var TOKEN = JSON.parse(localStorage.getItem("currentUser"))?.accessToken; 
}


export const publicRequest = axios.create({
    baseURL: BASE_URL
})
export const userRequest = axios.create({
    baseURL: BASE_URL,
    headers: {'x-access-token': `${TOKEN}`}
})
export const publicRequestV2 = axios.create({
    baseURL: BASE_URL_V2
})
export const userRequestV2 = axios.create({
    baseURL: BASE_URL_V2,
    headers: {'x-access-token': `${TOKEN}`}
})