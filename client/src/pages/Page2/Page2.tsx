import { useEffect, useState } from 'react'
import { Form, redirect } from 'react-router-dom'
import io from 'socket.io-client'

const socket = io('/')

export default function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  // MANDAS EL MENSAJE AL SERVIDOR
  const handleSubmit = e => {
    e.preventDefault() // Previene el comportamiento predeterminado del formulario
    const newMsg = {
      from: 'Me',
      body: message,
    }
    setMessages([...messages, newMsg])
    socket.emit('message', message)
    setMessage('') // Limpia el campo de entrada después de enviar
  }

  useEffect(() => {
    const messageListener = message => {
      setMessages(messages => [...messages, message])
    }

    socket.on('messageClient', messageListener)

    return () => {
      socket.off('messageClient', messageListener)
    }
  }, [])
  return (
    <Form onSubmit={handleSubmit} method="POST">
      <input type="text" placeholder="Write..." onChange={e => setMessage(e.target.value)} className="border" />
      <button type="submit" className="p-2 bg-blue-400 border">
        Send
      </button>
      <ul>
        {messages.map((message, index) => (
          <li key={index} className="m-2">
            {message.from}:{message.body}
          </li>
        ))}
      </ul>
    </Form>
  )
}
