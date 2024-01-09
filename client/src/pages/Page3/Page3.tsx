import { useAuth } from '@/auth/AuthProvider'
import { useEffect, useState } from 'react'
import { Form, redirect, useActionData, useLoaderData } from 'react-router-dom'
import io from 'socket.io-client'

const socket = io('/')

export async function loader() {
  const users = await fetch('http://localhost:5000/api/users').then(res => res.json())

  return { users }
}

export async function action({ request }) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')

  await fetch('http://localhost:5000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: name, email: email }),
  })

  // Retornar un estado de éxito
  // return redirect('/user')
  return { success: true }
}

export default function Page3() {
  const data = useLoaderData() as { users: any[] }
  const { user, login, logout } = useAuth()
  console.log('user', user)

  const [users, setUsers] = useState(data.users)

  useEffect(() => {
    const usersListener = user => {
      setUsers(users => [...users, user])
    }

    socket.on('newUser', usersListener)

    return () => {
      socket.off('newUser', usersListener)
    }
  }, [])

  return (
    <Form method="POST">
      <input type="text" placeholder="Name..." name="name" className="border" />
      <input type="text" placeholder="email..." name="email" className="border" />

      <button type="submit" className="p-2 bg-blue-400 border">
        Send
      </button>
      <ul>
        {users.map((user, index) => (
          <li key={index} className="m-2">
            {user.name}:{user.email}
          </li>
        ))}
      </ul>
    </Form>
  )
}
