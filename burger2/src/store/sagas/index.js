import { takeEvery } from 'redux-saga/effects'
import { logoutSaga, checkAuthTimeoutSage } from './auth'
import * as actionTypes from '../actions/actionTypes'

export function* watchAuth() {
    yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSage)
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga)
}