import { useReducer, useCallback } from 'react'

const httpReducer = (currentHttpState, action) => {
    switch(action.type) {
        case 'SEND':
            return { loading: true, error: null, data: null, extra: null, identifier: action.identifier }
        case 'RESPONSE':
            return { ...currentHttpState, loading: false, data: action.responseData, extra: action.extra }
        case 'ERROR':
            return { loading: false, error: action.errorMessage }
        case 'CLEAR':
            return { ...currentHttpState, error: null }
        default:
            throw new Error('Should not be reached!')
    }
}
  
const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, { 
        loading: false, 
        error: null,
        data: null,
        extra: null,
        identifier: null
     })

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifer) => {
        dispatchHttp({type: 'SEND', identifier: reqIdentifer})
        fetch(url, {
            method,
            body,
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => {
            return response.json()
        })
        .then(responseData => {
            dispatchHttp({type: 'RESPONSE', responseData, extra: reqExtra})
        })
        .catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: 'something went wrong:' + error.message})
        })
    }, [])

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest,
        reqExtra: httpState.extra,
        reqIdentifer: httpState.identifier
    }
}

export default useHttp