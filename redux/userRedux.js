import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        initialState: null,
        isFetching: false,
        error: false,
        user: {
            donations:{
            },
        }


      },
    reducers: {
        loginStart: (state)=>{
            state.isFetching = true;
            state.error = false;
        },
        loginSuccess: (state, action)=>{
            state.isFetching = false;
            state.currentUser = action.payload
            state.error = false;
            
        },
        loginFailure: (state, action)=>{
            state.isFetching = false;
            state.error = true;
            state.errorMessage = action.payload
        },
        setProfileUser: (state, action)=>{
            state.user = action.payload;
        },
        setDashboardData: (state, action)=>{
            state.user.dashboardData = action.payload;
        },
        setIsLoadingDashboardData: (state, action)=>{
            state.user.isLoadingDashboardData = action.payload;
        },
        setDonationsObj: (state, action)=>{
            state.user.donations = action.payload;
        },
        setPageViewsCount: (state, action)=>{
            state.user.pageViewsCount = action.payload;

        },
        setDonationTransactionsData: (state,action)=>{
            state.user.donationTransactionsData = action.payload;
        },
        setSupportMeTransactionsData: (state,action)=>{
            state.user.supportMeTransactionsData = action.payload;
        },
        setViewsChartData: (state,action)=>{
            state.user.viewsChartData = action.payload;
        }

    }
})

export const { loginStart, loginSuccess, loginFailure, setProfileUser, setDonationsObj, setPageViewsCount,setDonationTransactionsData, setSupportMeTransactionsData,setViewsChartData, setDashboardData, setIsLoadingDashboardData  } = userSlice.actions;
export default userSlice.reducer; 