import React, { useEffect } from 'react';
import { Route } from "react-router-dom";
import api from '../../Utils/api';
import Login from '../../Views/Login/Login';
import { useDispatch, useSelector } from "react-redux";

import { changeUserAction } from "../../Utils/store/actions";



/**
 * 
 * @param {String} pathname, в който се опитваме да влезем
 * @param {String} permission permission-ът нужен за достъп до страницата
 * Ако няма токен рендърва логин компонентата, и след успешен логин редиректва към правилния URL 
 */
const PrivateRoute = ({ path, permission, component, ...props }) => {
    const user = useSelector(state => state.user);
    const accessToken = api.getAccessToken();
    const dispatch = useDispatch();
    const changeUser = user => dispatch(changeUserAction(user));
    
    useEffect(() => {
        if(!user.username){
            changeUser(api.getUser());
        }
    }, []);
    // window.localStorage.setItem('accessToken', '');
    // window.localStorage.setItem('refreshToken', '');
    // window.localStorage.setItem('user', '{}');

    if (accessToken !== undefined && accessToken !== null && accessToken !== 'null' && accessToken !== 'undefined') {
        if (!permission.length || (user.role && permission.indexOf(user.role) !== -1)) {
            return <Route path={path} component={component} {...props} />;
        } else {
            return () => <div></div>;
        }
    } else {
        return <Login goTo={path} />;
    }
}

export default PrivateRoute;