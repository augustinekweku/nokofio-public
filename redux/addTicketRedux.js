import { createSlice } from "@reduxjs/toolkit";

const ticketSlice = createSlice({
    name: "ticket",
    initialState: {
        ticketArray: [],
      },
    reducers: {
        setTicketArray: (state, action)=>{
            // add the ticket object
            state.ticketArray.push(action.payload);
        },
        updateTicketArray: (state, action)=>{
            // update the ticket array
        state.ticketArray = action.payload;
        },
        clearTicketArray: (state, action)=>{
            // update the ticket object
            state.ticketArray = [];
              
        }

    }
})

export const { setTicketArray, clearTicketArray, updateTicketArray } = ticketSlice.actions;
export default ticketSlice.reducer; 