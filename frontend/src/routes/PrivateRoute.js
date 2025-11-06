import React from 'react';
import UseAuth from '../hook/UseAuth';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children,allowedRoles}) => {
    const {user,loading,isAuthenticated}=UseAuth();
    if(loading){
        return <h1>Loading...</h1>
    }
    if(!isAuthenticated) {return <Navigate to="/login" replace={true}/>}
    if(!allowedRoles.includes(user.role)){
        return <Navigate to="/forbidden" replace/>
    }
    return children;
};

export default PrivateRoute;