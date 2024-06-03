import HttpClient from "../helpers/http-client";
const httpClient = new HttpClient();

 const getContributors = async (username) => {
    return await httpClient.publicRequest.get(`supportmycontent/contributors?username=${username}`);
}

const getTransactions = async (filterDate) => {
    return await httpClient.userRequest.get(`/supportMyContent/transactions?period=${filterDate}`);
}

const deletePaymentLink = async (id) => {
    return await httpClient.userRequest.delete(`/sections/supportMyContent/delete/${id}`);
}



const supportMyContentServices = {
    getContributors,
    getTransactions,
    deletePaymentLink
}

export default supportMyContentServices;