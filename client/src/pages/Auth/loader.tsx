import { json, redirect } from 'react-router-dom'

export async function loader({ request }) {
  try {
    // Realizar una solicitud al endpoint que verifica el estado de autenticación
    const response = await fetch('http://localhost:5000/auth/status', {
      credentials: 'include', // Importante para incluir las cookies en la solicitud
    })

    if (!response.ok) {
      // Si la respuesta no es OK, significa que el usuario no está autenticado
      return { isAuthenticated: false }
    } else {
      return redirect('/')
    }
  } catch (error) {
    console.error('Error al verificar el estado de autenticación Login.tsx linea 48:', error)
    return { isAuthenticated: false }
  }
  return json({ user: null })
}
