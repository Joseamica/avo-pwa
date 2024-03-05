import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? 'https://avo-pwa.onrender.com/' : 'http://localhost:5000',
  // withCredentials: true,
})

export default api
