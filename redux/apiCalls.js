import { loginStart, loginSuccess, loginFailure } from "./userRedux";
import { publicRequest } from "../requestMethods";
import { getCookies, setCookie, deleteCookie } from 'cookies-next';


export const login = async (dispatch, user) => {
    dispatch(loginStart());
    

    try {
        const res = await publicRequest.post("/auth/signin", user);
        dispatch(loginSuccess(res.data))
        localStorage.setItem("currentUser", JSON.stringify(res.data));
          // Set
          setCookie('nokofio_user', JSON.stringify(res.data));

        location.href="/builder"
        
    } catch (error) {
        //alert(JSON.stringify(error.response.data.message))
        dispatch(loginFailure(error?.response?.data?.message)) 
    }
}





