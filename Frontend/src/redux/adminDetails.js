import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminInfo: {},
    locations: [],
    chargePoints: [],
    rates: [],
    users: [],
    rfids: [],
    sessions: [],
    logs: [],
};

export const adminDetails = createSlice({
    name: "errorMessage",
    initialState,
    reducers: {
        createAdminInfo: (state, action) => {
            state.adminInfo = action.payload;
        },
        createLocation: (state, action) => {
            state.locations = action.payload;
        },
        createChargePoints: (state, action) => {
            state.chargePoints = action.payload;
        },
        createRates: (state, action) => {
            state.rates = action.payload;
        },
        createUsers: (state, action) => {
            state.users = action.payload;
        },
        createRfids: (state, action) => {
            state.rfids = action.payload;
        },
        createSessions: (state, action) => {
            state.sessions = action.payload;
        },
        createLogs: (state, action) => {
            state.logs = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    createAdminInfo,
    createLocation,
    createChargePoints,
    createUsers,
    createRates,
    createRfids,
    createSessions,
    createLogs,
} = adminDetails.actions;

export default adminDetails.reducer;
