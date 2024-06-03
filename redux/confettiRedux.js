import { createSlice } from "@reduxjs/toolkit";

const confettiSlice = createSlice({
    name: "confetti",
    initialState: {
        showConfetti: false,
      },
    reducers: {
        turnOnConfetti: (state)=>{
            state.showConfetti = true;
        },
        turnOffConfetti: (state)=>{
            state.showConfetti = false;            
        },

    }
})

export const { turnOnConfetti, turnOffConfetti } = confettiSlice.actions;
export default confettiSlice.reducer; 