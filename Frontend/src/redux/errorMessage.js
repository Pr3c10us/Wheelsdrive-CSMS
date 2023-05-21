import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    errorMessage: "",
    showErrorMessage: "",
    errorMessageType: "Something went wrong",
};

export const errorMessageSlice = createSlice({
    name: "errorMessage",
    initialState,
    reducers: {
        changeErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        changeShowErrorMessage: (state, action) => {
            state.showErrorMessage = action.payload;
        },
        changeErrorMessageType: (state, action) => {
            state.errorMessageType = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    changeErrorMessage,
    changeErrorMessageType,
    changeShowErrorMessage,
} = errorMessageSlice.actions;

export default errorMessageSlice.reducer;
