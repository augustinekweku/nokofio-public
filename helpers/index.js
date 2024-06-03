import { deleteCookie } from "cookies-next";

export const removeSpaces = (val) =>{
    return val.replace(/ /g, '');
}

export const truncateText = (text, length) => {
    if (text?.length < 10) return text;
    return text?.length > length ? text?.substring(0, length) + "..." : text;
}

export const formatDurationInHours = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    const hoursText = hours > 1 ? "hours" : "hour";
    const minutesText = minutes > 1 ? "minutes" : "minute";
    if (hours === 0) return `${minutes} ${minutesText}`;
    if (minutes === 0) return `${hours} ${hoursText}`;
    return `  ${hours} ${hoursText} ${minutes} ${minutesText}`;
}


export const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GHS",
    }).format(amount);
}


export const logoutUserAndRedirect = () => {
        //check if window is available
        deleteCookie('nokofio_user') 
        if (typeof window !== "undefined") {
          localStorage.removeItem("currentUser");
          localStorage.removeItem("nokofioProfile");
          location.href = "/login";
        }
}
export const clearUserSession = () => {
        //check if window is available
        deleteCookie('nokofio_user') 
        if (typeof window !== "undefined") {
          localStorage.removeItem("currentUser");
          localStorage.removeItem("nokofioProfile");
        }
}

export const captilazeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function ApiErrorParser(error) {
    return (
       error?.response?.data?.message + " || " + error?.response?.data?.errors  ||
      error?.response?.data?.errors ||
      "Something went wrong"
    );
  }

  export const  removeZeroFromFirstIndex = (text) => {
    if(text?.toString().charAt(0) === '0' && text?.toString()?.length > 1){
        return text.slice(1);
    }
    return text;
  }
