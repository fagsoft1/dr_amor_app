import React, {useState, useEffect, useContext, createContext} from "react";
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../01_actions'

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({children}) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
    return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
    const dispatch = useDispatch();

    // Wrap any Firebase methods we want to use making sure ...
    // ... to save the user to state.
    const signin = (username, password, option_actions = {}) => {
        return dispatch(actions.login(username, password, option_actions));
    };

    const signup = (username, password, option_actions = {}) => {
        console.log('logica aquí')
    };

    const signout = (options_action = {}) => {
        return dispatch(actions.logout(options_action));
    };

    const sendPasswordResetEmail = email => {
        console.log('aqui la lógica')
    };

    const confirmPasswordReset = (code, password) => {
        console.log('aqui la lógica')
    };

    // Subscribe to user on mount
    // Because this sets state in the callback it will cause any ...
    // ... component that utilizes this hook to re-render with the ...
    // ... latest auth object.
    const auth = useSelector(state => state.auth);
    useEffect(() => {
        dispatch(actions.loadUser());
    }, []);

    // Return the user object and auth methods
    return {
        auth,
        signin,
        signup,
        signout,
        sendPasswordResetEmail,
        confirmPasswordReset
    };
}