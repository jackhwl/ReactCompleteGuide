import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://react-my-burger-66316.firebaseio.com/'
})

//instance.defaults.headers.common['Authorization']='AUTH TOKEN FROM INSTANCE'

// instance.interceptors.request

export default instance