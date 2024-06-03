import { createSlice } from "@reduxjs/toolkit";

const fullPageLoadingSlice = createSlice({
    name: "fullPageLoading",
    initialState: {
        fullPageLoading: false,
      },
    reducers: {
        setFullPageLoading: (state, action)=>{
            state.fullPageLoading = action.payload;
        }

    }
})

export const { setFullPageLoading } = fullPageLoadingSlice.actions;
export default fullPageLoadingSlice.reducer; 