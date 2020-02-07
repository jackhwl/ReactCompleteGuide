import axios from 'axios'
import { AUTH_USER, AUTH_ERROR } from './types'

export const signup = formProps => dispatch => {
    try {
        const response = axios.post('http://localhost:3090/signup', formProps)
        dispatch({ type: AUTH_USER, payload: response.data.token})
    } catch (e) {
        dispatch({ type: AUTH_ERROR, payload: 'Email in use'})
    }
}