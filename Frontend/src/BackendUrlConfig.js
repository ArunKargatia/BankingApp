import axios from 'axios';

const backendUrl = axios.create({
    baseURL: 'http://localhost:8080',
})

export default backendUrl;