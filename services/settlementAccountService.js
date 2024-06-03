import { logoutUserAndRedirect } from "../helpers";
import { userRequest } from "../requestMethods";

export const getSettlementAccount = async () => {
    try {
        const res = await userRequest.get(`settlementAccount`);
        return res.data;
    } catch (error) {
        if (error.response.status === 401) {
        logoutUserAndRedirect();
        }
    }
}

