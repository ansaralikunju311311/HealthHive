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
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.doctor = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isActive = false;
        },
        updateProfile: (state, action) => {
            state.doctor = { ...state.doctor, ...action.payload };
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
    setLoading,
    setError,
    clearError,
    logout,
    updateProfile,
    setVerificationStatus
} = doctorSlice.actions;

export default doctorSlice.reducer;
