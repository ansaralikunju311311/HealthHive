import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    doctor: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isActive: false
};

const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        setDoctor: (state, action) => {
            state.doctor = action.payload;
            state.isAuthenticated = true;
            state.isActive = action.payload.isActive;
            console.log("isdetails===",state.doctor);
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.doctor = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isActive = false;
        },
        setVerificationStatus: (state, action) => {
            state.isActive = action.payload;
            if (state.doctor) {
                state.doctor.isActive = action.payload;
            }
        }
    }
});

export const {
    setDoctor,
    setToken,
    logout,
    setVerificationStatus
} = doctorSlice.actions;

export default doctorSlice.reducer;
