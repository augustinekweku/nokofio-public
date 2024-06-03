import HttpClient from "../helpers/http-client";
const httpClient = new HttpClient();

 const getContributors = async (username) => {
    return await httpClient.publicRequest.get(`donation/contributors?username=${username}`);
}

const getTransactions = async (filterDate) => {
    return await httpClient.userRequest.get(`/donation/transactions?period=${filterDate}`);
}

const deleteDonationLink = async (id) => {
    return await httpClient.userRequest.delete(`/sections/donation/delete/${id}`);
}

const payWithECedi = async ({
    receiverUsername,
    senderPhoneNumber,
    amount,
    donationId,
    sender,
    walletId
}) => {
    return await httpClient.userRequest.post(`/transactions/payWithEcedi`, {
        receiverUsername,
        senderPhoneNumber,
        amount,
        donationId,
        sender,
        walletId
    });

}






const donationServices = {
    getContributors,
    getTransactions,
    deleteDonationLink,
    payWithECedi
}

export default donationServices;