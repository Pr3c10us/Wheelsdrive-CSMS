import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminInfo: {},
};

export const adminDetails = createSlice({
    name: "errorMessage",
    initialState,
    reducers: {
        createAdminInfo: (state, action) => {
            state.adminInfo = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { createAdminInfo } = adminDetails.actions;

export default adminDetails.reducer;
