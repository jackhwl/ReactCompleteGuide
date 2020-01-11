import { push } from 'connected-react-router'
// push return an action
export default {
    go(to) {
        return push(to)
    }
}