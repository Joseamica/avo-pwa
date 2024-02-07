import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging/sw'

importScripts('https://www.gstatic.com/firebasejs/9.2.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.2.1/firebase-messaging-compat.js')

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const config = {
  apiKey: 'AIzaSyDO_YD4EhiJVcmS-7O189B7J3j0cwPp1lQ',
  authDomain: 'avoqado-d0a24.firebaseapp.com',
  projectId: 'avoqado-d0a24',
  storageBucket: 'avoqado-d0a24.appspot.com',
  messagingSenderId: '219752736783',
  appId: '1:219752736783:web:e03d3b812775a14652db7a',
  measurementId: 'G-RHVHM6V578',
}

app = firebase.initializeApp(config)
const messaging = firebase.messaging(app)

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  const notificationTitle = payload.data.title
  const notificationOptions = {
    body: payload.data.body,
    icon: '/firebase-logo.png',
  }
  return self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', event => {
  console.log(event)
  return event
})
