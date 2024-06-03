export  const timeIntervals = 
    [
        { label: '12:00 AM', value: '00:00' },
        { label: '01:30 AM', value: '00:30' },
        { label: '01:00 AM', value: '01:00' },
        { label: '01:30 AM', value: '01:30' },
        { label: '02:00 AM', value: '02:00' },
        { label: '02:30 AM', value: '02:30' },
        { label: '03:00 AM', value: '03:00' },
        { label: '03:30 AM', value: '03:30' },
        { label: '04:00 AM', value: '04:00' },
        { label: '04:30 AM', value: '04:30' },
        { label: '05:00 AM', value: '05:00' },
        { label: '05:30 AM', value: '05:30' },
        { label: '06:00 AM', value: '06:00' },
        { label: '06:30 AM', value: '06:30' },
        { label: '07:00 AM', value: '07:00' },
        { label: '07:30 AM', value: '07:30' },
        { label: '08:00 AM', value: '08:00' },
        { label: '08:30 AM', value: '08:30' },
        { label: '09:00 AM', value: '09:00' },
        { label: '09:30 AM', value: '09:30' },
        { label: '10:00 AM', value: '10:00' },
        { label: '10:30 AM', value: '10:30' },
        { label: '11:00 AM', value: '11:00' },
        { label: '11:30 AM', value: '11:30' },
        { label: '12:00 PM', value: '12:00' },
        { label: '12:30 PM', value: '12:30' },
        { label: '01:00 PM', value: '13:00' },
        { label: '01:30 PM', value: '13:30' },
        { label: '02:00 PM', value: '14:00' },
        { label: '02:30 PM', value: '14:30' },
        { label: '03:00 PM', value: '15:00' },
        { label: '03:30 PM', value: '15:30' },
        { label: '04:00 PM', value: '16:00' },
        { label: '04:30 PM', value: '16:30' },
        { label: '05:00 PM', value: '17:00' },
        { label: '05:30 PM', value: '17:30' },
        { label: '06:00 PM', value: '18:00' },
        { label: '06:30 PM', value: '18:30' },
        { label: '07:00 PM', value: '19:00' },
        { label: '07:30 PM', value: '19:30' },
        { label: '08:00 PM', value: '20:00' },
        { label: '08:30 PM', value: '20:30' },
        { label: '09:00 PM', value: '21:00' },
        { label: '09:30 PM', value: '21:30' },
        { label: '10:00 PM', value: '22:00' },
        { label: '10:30 PM', value: '22:30' },
        { label: '11:00 PM', value: '23:00' },
        { label: '11:30 PM', value: '23:30' },
    ]


    export const PAYMENT_TYPES = {
        donation: "donation",
        accept_payment: "accept_payment",
      };


export const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        if (hostname === "localhost") {
            return 'http://'+ window.location.host;
           
        } else {
            return 'https://'+ window.location.host;
        }
    }
}

export const PAYMENT_HISTORY_FILTERS = {
    today: "today",
    last_7_days: "7",
    last_30_days: "30",
    last_90_days: "90",
    all_time: "all",
    };




export const CHECKERPRICES = {
    BECE: {
      unit_price: 20,
      bulk_price: 20,
      bulk_price_50: 18,
    },
    WASSCE: {
      unit_price: 20,
      bulk_price: 20,
      bulk_price_50: 18,
    },
    CSSPS: {
      unit_price: 12,
      bulk_price: 8,
    },
    CHECKING: {
      unit_price: 28,
    },
  };

  // export const API_URL_V1 = "http://localhost:3001/api/v1";
  // export const API_URL_V2 = "http://localhost:3001/api/v2";
  export const API_URL_V1 = "https://nokofi.herokuapp.com/api/v1";
  export const API_URL_V2 = "https://nokofi.herokuapp.com/api/v2";