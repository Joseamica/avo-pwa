import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Fallback to localhost if env variable isn't set
})

export default instance
