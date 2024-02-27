import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000' : 'https://avo-pwa.onrender.com/',
})

export default instance
