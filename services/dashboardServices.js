import HttpClient from "../helpers/http-client";
import { userRequestV2 } from "../requestMethods";
const httpClient = new HttpClient();

 const getLinksData = async (period) => {
    return await userRequestV2.get(`transactions/dashboard?period=${period}`);
}
 const getPaymentHistoryById = async (id, period) => {
    return await userRequestV2.get(`transactions/trends?period=${period}&id=${id}`);
}









const dashboardServices = {
    getLinksData,
    getPaymentHistoryById
}

export default dashboardServices;