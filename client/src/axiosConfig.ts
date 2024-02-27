import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? 'https://avo-pwa.onrender.com/' : 'http://localhost:5000',
})

export default instance
