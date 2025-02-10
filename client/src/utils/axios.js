import axios from 'axios'

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api` || 'http://localhost:3000/api',  // Y our backend url
    withCredentials: true,
})

export default instance