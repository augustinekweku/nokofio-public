import { createSlice } from "@reduxjs/toolkit";

const donationViewsSlice = createSlice({
    name: "confetti",
    initialState: {
        enterAmountView: true,
        enterNumberView: false,
        enterOtpView: false,
        sucessView: false,
        failedView: false,
        loadingView: false,
        confirmView: false,
        donationObject:{}
      },
    reducers: {
        showAmountView: (state,action)=>{
            state.enterAmountView = action.payload;
        },
        showNumberView: (state, action)=>{
            state.enterNumberView = action.payload;
        },
        showOtpView: (state, action)=>{
            state.enterOtpView = action.payload;
        },
        showSuccessView: (state, action)=>{
            state.sucessView = action.payload;
        },
        showFailedView: (state, action)=>{
            state.failedView = action.payload;
        },
        showLoadingView: (state, action)=>{
            state.loadingView = action.payload;
        },
        showConfirmView: (state, action)=>{
            state.confirmView = action.payload;
        },
        setDonationObject: (state, action)=>{
            // update the donation object
            state.donationObject = Object.assign(action.payload, state.donationObject);
              
        },
        clearDonationObject: (state, action)=>{
            // update the donation object
            state.donationObject = {};
              
        }

    }
})

export const { showAmountView, showNumberView, showOtpView, showSuccessView,  showFailedView, showLoadingView,showConfirmView, setDonationObject, clearDonationObject} = donationViewsSlice.actions;
export default donationViewsSlice.reducer; 