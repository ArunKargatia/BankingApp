import axios from 'axios';

const backendUrl = axios.create({
    baseURL: 'https://bankingapp-jpot.onrender.com/',
})

export default backendUrl;