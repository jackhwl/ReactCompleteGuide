import counter from './counter'
import { all  } from 'redux-saga/effects'

export default function* rootSaga() {
    //Promise.all
    yield all([
        counter()
    ])
}

/**
 * 1. rootSaga
 * 2. watch Saga
 * 3. workerSaga
 */