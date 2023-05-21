import { configureStore } from "@reduxjs/toolkit";
import errorMessageReducer from "./errorMessage";
import adminDetails from "./adminDetails";

export default configureStore({
    reducer: {
        errorMessage: errorMessageReducer,
        adminDetails: adminDetails,
    },
});
