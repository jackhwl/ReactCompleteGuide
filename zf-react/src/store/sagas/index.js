import { takeEvery, delay, put  } from 'redux-saga/effects'
import * as types from '../actionType'

function* delayAdd() {
    yield delay(1000)
    yield put({type: types.ADD})
}
export default function* rootSaga() {
    yield takeEvery(types.DELAY_ADD, delayAdd)
}

/**
 * 1. rootSaga
 * 2. watch Saga
 * 3. workerSaga
 */