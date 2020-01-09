import React, {useState, useEffect} from 'react'
import Modal from '../../components/UI/Modal/Modal'
import Aux from '../Auxlib/Auxlib'
import useHttpErrorHandler from '../../hooks/http-error-handler'

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        // constructor() {
        //     super()
        //     this.reqInterceptor = axios.interceptors.request.use(req => {
        //         this.setState({error: null})
        //         return req
        //     })
        //     this.resInterceptor = axios.interceptors.response.use(res => res, error => {
        //         this.setState({error: error})
        //     })
        //     //console.log('withErrorHandler constructor', this.reqInterceptor, this.resInterceptor)
        // }
        // componentWillUnmount(){
        //     //console.log('withErrorHandler componentWillUnmount', this.reqInterceptor, this.resInterceptor)
        //     axios.interceptors.request.eject(this.reqInterceptor)
        //     axios.interceptors.response.eject(this.resInterceptor)
        // }

        // componentWillMount() {
        //     axios.interceptors.request.use(req => {
        //         this.setState({error: null})
        //         return req
        //     })
        //     axios.interceptors.response.use(res => res, error => {
        //         this.setState({error: error})
        //     })
        // }

        const [error, clearError] = useHttpErrorHandler(axios)
        // const [error, setError] = useState(null)
        // const reqInterceptor = axios.interceptors.request.use(req => {
        //     setError(null)
        //     return req
        // })
        // const resInterceptor = axios.interceptors.response.use(res => res, err => {
        //     setError(err)
        // })

        // useEffect(() => {
        //     return () => {
        //         axios.interceptors.request.eject(reqInterceptor)
        //         axios.interceptors.response.eject(resInterceptor)
        //     };
        // }, [reqInterceptor, resInterceptor])

        // const errorConfirmedHandler = () => {
        //     setError(null)
        // }


            return  (
                <Aux>
                    <Modal 
                        show={error}
                        modalClosed={clearError}
                    >
                        {error ? error.message : null}
                    </Modal>
                    <WrappedComponent {...props} />
                </Aux>
            )

    }
}

export default withErrorHandler
