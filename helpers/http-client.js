import axios from 'axios';
import { API_URL_V1, API_URL_V2 } from './constants';
const BASE_URL = API_URL_V1;
const BASE_URL_V2 = API_URL_V2;

if (typeof window !== "undefined") {
    var TOKEN = JSON.parse(localStorage.getItem("currentUser"))?.accessToken; 
}
export default class  HttpClient {
    constructor() {
        this.publicRequest = axios.create({
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
        });
        this.userRequest = axios.create({
        baseURL: BASE_URL,
        headers: {'x-access-token': `${TOKEN}`,
            "Content-Type": "application/json",
        },
        });
        this.publicRequestV2 = axios.create({
        baseURL: BASE_URL_V2,
        headers: {
            "Content-Type": "application/json",
        },
        });
        this.userRequestV2 = axios.create({
        baseURL: BASE_URL_V2,
        headers: {'x-access-token': `${TOKEN}`,
            "Content-Type": "application/json",
        },
        });



    }

    

    ////////////////////////// YET TO BE USED //////////////////////////
    setAuthorizationHeader() {
        this.publicRequest.defaults.headers.common["Content-Type"] = `multipart/form-data`;
    }


    addAuthorizationHeaders(headersObject) {
        for (const [headerKey, headerValue] of Object.entries(headersObject)) {
            this.userRequest.defaults.headers.common[headerKey] = headerValue;
        }
    }

    
    removeAuthorizationHeader() {
        delete this.publicRequest.defaults.headers.common["Authorization"];
    }
    
    async get(url, params = {}) {
        return await this.publicRequest.get(url, { params });
    }
    
    async post(url, data = {}) {
        return await this.publicRequest.post(url, data);
    }
    
    async put(url, data = {}) {
        return await this.publicRequest.put(url, data);
    }
    
    async delete(url) {
        return await this.publicRequest.delete(url);
    }

}