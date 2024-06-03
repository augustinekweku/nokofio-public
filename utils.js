// import moment from "moment";
import { publicRequest, userRequest } from './requestMethods';
import { getCookie, deleteCookie } from 'cookies-next';


export const TruncateString = (text, truncatePos) => {
    var truncString = text?.substring(0, truncatePos);
    return truncString + "..."
}

export  const toDateTime = (dateString) => {
    const t = new Date(dateString);
    let day = t.getDate();
let month = t.getMonth();
let year = t.getFullYear();
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov', 'Dec']
let date = day + '-' + months[month] + '-' + year

    return  date;
  };
export  const getTodaysDate = () => {
  const date = new Date();
let dayOfWeek = date.getDay();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();
const days = [ 'Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov', 'Dec']

let currentDate = `${days[dayOfWeek]} ${day}, ${months[month]} ${year}`;
return currentDate;
  };

  export const logoutUser = () => {
    //check if window is available
    destroyCookie(null, 'nokofio_user') 
    if (typeof window !== "undefined") {
      console.log("logout");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("nokofioProfile");
      location.href = "/login";
    }
  }


  export  const getProfile = async () => {
    const cookie = getCookie("nokofio_user");
    if (cookie) {
      const user =  JSON.parse(getCookie("nokofio_user"));
      try {
        const res = await publicRequest.get(`/user/me?username=${user.username}`);
        if (
          res.status === 200
        ) {
          return res.data.results.data;
        }
      } catch (error) {
        if (error.response.status === 401) {
          // Destroy
          deleteCookie("nokofio_user");
          location.href = "/login";
        }
      }
    }
  };
  export  const getUserDonations = async () => {

    try {
      const amountDonatedRes = await userRequest.get(
        `donation/transactions/amount`
      );
      const donationTransactionsRes = await userRequest.get(
        `donation/transactions/`
      );
      const supportMeInfoRes = await userRequest.get(
        `sections/supportMeAmount`
      );
      const supportMeTransactionsRes = await userRequest.get(
        `supportmycontent/transactions`
      );

      if (
        amountDonatedRes.status === 200 &&
        donationTransactionsRes.status === 200 &&
        supportMeInfoRes.status === 200 &&
        supportMeTransactionsRes.status === 200 
      ) {
        const donationObj = {
          donation: {
            amountDonated: amountDonatedRes.data,
            donationsCount: donationTransactionsRes.data.results.data.length === 0 ? "0" : donationTransactionsRes.data.results.data.length ,
            doantionsArr: donationTransactionsRes.data.results
          },
          supportMyContent:{
            supportMeInfo: supportMeInfoRes.data.results.data,
            supportMeTransactions: supportMeTransactionsRes.data.results.data,
            transactionsCount: supportMeTransactionsRes.data.results.data.length === 0 ? "0" : supportMeTransactionsRes.data.results.data.length
          }
        };
        return donationObj;
      }
    } catch (error) {
      if (error.response.status === 401) {
        // Destroy
        destroyCookie(null, "nokofio_user");
        location.href = "/login";
      }
    }
  };




