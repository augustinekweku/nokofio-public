import { userRequest } from "../requestMethods";

/* eslint-disable import/no-anonymous-default-export */
 const getTotalAmountSold = async (period) => {
    return await userRequest.get(`digitalproduct/transactions/amount?period=${period}`);
}

export default {
    getTotalAmountSold
}