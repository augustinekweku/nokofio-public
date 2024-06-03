import HttpClient from "../helpers/http-client";
const httpClient = new HttpClient();

 const createBooking = async (bookingObj) => {
    return await httpClient.userRequest.post(`appointment/slot`, bookingObj);
}

const getBookings = async () => {
    return await httpClient.userRequest.get(`appointment/slot`);
}
const deleteBooking = async (id) => {
    return await httpClient.userRequest.delete(`appointment/slot/${id}`);
}



const bookingServices = {
    createBooking,
    getBookings,
    deleteBooking
}

export default bookingServices;