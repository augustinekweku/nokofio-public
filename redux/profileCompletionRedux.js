import { createSlice } from "@reduxjs/toolkit";

const profileCompletionSlice = createSlice({
    name: "fullPageLoading",
    initialState: {
        fullPageLoading: false,
      },
    reducers: {
        setProfileCompletion: (state, action)=>{
            state.fullPageLoading = action.payload;
        }

    }
})

export const { setProfileCompletion } = profileCompletionSlice.actions;
export default profileCompletionSlice.reducer; 