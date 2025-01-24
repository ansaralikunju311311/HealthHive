import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Features/userSlice';
import doctorReducer from './Features/DoctorSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        doctor: doctorReducer
    }
});

export default store;