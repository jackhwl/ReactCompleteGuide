import { takeEvery, delay, put  } from 'redux-saga/effects'
import * as types from '../actionType'

function* delayAdd() {
    yield delay(1000)
    yield put({type: types.ADD})
}

export default function* watcherDelayAdd() {
    //Promise.all
    yield takeEvery(types.DELAY_ADD, delayAdd)
}
 