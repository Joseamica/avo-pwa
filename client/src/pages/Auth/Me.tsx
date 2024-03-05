import { Form, json, redirect } from 'react-router-dom'

export async function action({ request }) {
  localStorage.removeItem('persist:user')
  const res = await fetch('http://localhost:5000/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  if (res.ok) {
    return redirect('/auth/login')
  }
  return json({ error: 'Error al cerrar sesión' })
}

export default function Me() {
  return (
    <Form method="POST">
      <button>Logout</button>
    </Form>
  )
}
