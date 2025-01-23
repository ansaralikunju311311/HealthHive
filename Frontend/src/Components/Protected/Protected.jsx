import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const Protected = ({ children }) => {
    console.log(children)
    const token = sessionStorage.getItem('useraccessToken')
    
    if (!token) {
        return <Navigate to="/login" replace={true} />
    }
    
    return children
}
