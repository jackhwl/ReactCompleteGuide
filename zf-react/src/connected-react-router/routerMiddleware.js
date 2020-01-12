import { CALL_HISTORY_METHOD } from './types'

export default function (history) {
    return function ({ dispatch, getState }) {
        return function (next) {
            return function (action) {
                if (action.type ===CALL_HISTORY_METHOD ) {
                    history[action.payload.method](...action.payload.args)
                } else {
                    next(action)
                }
            }
        }
    }
}