import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyDO_YD4EhiJVcmS-7O189B7J3j0cwPp1lQ',
  authDomain: 'avoqado-d0a24.firebaseapp.com',
  projectId: 'avoqado-d0a24',
  storageBucket: 'avoqado-d0a24.appspot.com',
  messagingSenderId: '219752736783',
  appId: '1:219752736783:web:e03d3b812775a14652db7a',
  measurementId: 'G-RHVHM6V578',
}
const firebaseApp = initializeApp(firebaseConfig)
const messaging = getMessaging(firebaseApp)

export default messaging
