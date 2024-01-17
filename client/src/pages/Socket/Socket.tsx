import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

// const URL = process.env.NODE_ENV === 'production' ? undefined : '/'
const URL = '/'

export const socket = io(URL, {
  autoConnect: true,
})

export default function Sockets() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [fooEvents, setFooEvents] = useState([])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onFooEvent(value) {
      setFooEvents(previous => [...previous, value])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('foo', onFooEvent)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('foo', onFooEvent)
    }
  }, [])

  return (
    <div className="App">
      <ConnectionState isConnected={isConnected} />
      <Events events={fooEvents} />
      <ConnectionManager />
      <MyForm />
    </div>
  )
}

export function ConnectionState({ isConnected }) {
  return <p>State: {'' + isConnected}</p>
}

export function Events({ events }) {
  return (
    <ul>
      pene
      {events.map((event, index) => (
        <li className="text-white" key={index}>
          pene
          {event}
        </li>
      ))}
    </ul>
  )
}

export function ConnectionManager() {
  function connect() {
    socket.connect()
  }

  function disconnect() {
    socket.disconnect()
  }

  return (
    <>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </>
  )
}

export function MyForm() {
  const [value, setValue] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)

    socket.timeout(5000).emit('create-something', value, () => {
      setIsLoading(false)
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <input onChange={e => setValue(e.target.value)} className="text-black" />

      <button type="submit" disabled={isLoading}>
        Submit
      </button>
    </form>
  )
}
