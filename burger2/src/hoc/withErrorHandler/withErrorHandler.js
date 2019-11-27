import React, {Component} from 'react'
import Modal from '../../components/UI/Modal/Modal'
import Aux from '../Auxlib/Auxlib'

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        constructor() {
            super()
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null})
                return req
            })
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error})
            })
            console.log('withErrorHandler constructor', this.reqInterceptor, this.resInterceptor)
        }
        componentWillUnmount(){
            console.log('withErrorHandler componentWillUnmount', this.reqInterceptor, this.resInterceptor)
            axios.interceptors.request.eject(this.reqInterceptor)
            axios.interceptors.response.eject(this.resInterceptor)
        }
        state = {
            error: null
        }

        // componentWillMount() {
        //     axios.interceptors.request.use(req => {
        //         this.setState({error: null})
        //         return req
        //     })
        //     axios.interceptors.response.use(res => res, error => {
        //         this.setState({error: error})
        //     })
        // }

        errorConfirmedHandler = () => {
            this.setState({error: null})
        }

        render() {
            return  (
                <Aux>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}
                    >
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            )
        }
    }
}

export default withErrorHandler
