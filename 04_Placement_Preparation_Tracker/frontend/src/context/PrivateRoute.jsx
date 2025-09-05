import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('token');
        if (!auth) {
            navigate('/login');
        }
    }, [navigate]);

    return children;
}

export default PrivateRoute