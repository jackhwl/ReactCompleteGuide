import axios from 'axios'
import * as actionTypes from './actionTypes'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error
    }
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart())
        const authData = {
            email,
            password,
            returnSecureToken: true
        }
        let api_key = 'AIzaSyC7TlFEBVh4GvRfelvTgjisnCW1HAXrY=M';
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + api_key;
        if (!isSignup) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + api_key;
        }
        axios.post(url, authData)
            .then(response => {
                console.log(response)
                dispatch(authSuccess(response.data))
            })
            .catch( err => {
                console.log(err)
                dispatch(authFail(err))
            })
    }
}