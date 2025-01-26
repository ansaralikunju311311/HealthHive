import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { setToken } from '../../redux/Features/userSlice.js'

export const Protected = ({ children }) => {
    console.log(children)
    const token = localStorage.getItem('useraccessToken')
    
    if (!token) {
        return <Navigate to="/login" replace={true} />
    }
    
    return children
}
