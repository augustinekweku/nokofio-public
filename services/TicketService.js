import HttpClient from "../helpers/http-client";
const httpClient = new HttpClient();

 const createTicket = async (ticketObj) => {
    return await httpClient.userRequest.post(`/ticketing/event`, ticketObj);
}
 const getTickets = async (ticketObj) => {
    return await httpClient.userRequest.get(`/ticketing/event`, ticketObj);
}
 const deleteTicket = async (ticketId) => {
    return await httpClient.userRequest.delete(`/ticketing/event/${ticketId}`);
}

const getEventsForPublic = async (username) => {
    return await httpClient.publicRequest.get(`/ticketing/event/public?username=${username}`);
}

const buyTicket = async (buyTicketObj) => {
    return await httpClient.userRequest.post(`ticketSales/purchase`, buyTicketObj);
}



const ticketServices = {
    createTicket,
    getTickets,
    deleteTicket,
    getEventsForPublic,
    buyTicket
}

export default ticketServices;