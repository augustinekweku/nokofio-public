import { testUserRequest, userRequest } from "../requestMethods";
import store from "../redux/store";


/* eslint-disable import/no-anonymous-default-export */
 const getDashboardData = async (period) => {
    return await userRequest.get(`transactions/dashboard?period=${period}`);
}


 const getUserProfile = async (username) => {
    const res =  await userRequest.get(`user/me?username=${username}`);
    if(res.data.results.data){
        store.dispatch({
            type: "user/setProfileUser",
            payload:  res.data.results.data
        })
    }
    return res;
}





export default {
    getDashboardData,
    getUserProfile
}