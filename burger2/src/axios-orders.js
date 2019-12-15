import axios from 'axios'
import firebaseConfig from './firebase.auth'
const instance = axios.create({
    baseURL: firebaseConfig.databaseURL
})

//instance.defaults.headers.common['Authorization']='AUTH TOKEN FROM INSTANCE'

// instance.interceptors.request

export default instance