import { useAuth } from '@/auth/AuthProvider'
import api from '@/axiosConfig'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Admin() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const params = useParams()
  const { isAdmin } = useAuth()
  console.log('isAdmin', isAdmin)
  const loginMutation = useMutation({
    mutationFn: (tableNumber: any) =>
      api.post('/v1/admin/create-table', {
        tableNumber,
        venueId: params.venueId,
        headers: {
          // Importante: No establecer 'Content-Type': 'multipart/form-data' manualmente.
          // Dejar que el navegador lo haga automáticamente para asegurar que el boundary se añada correctamente.
        },
        withCredentials: true,
      }),
    onSuccess: () => {
      setSuccess('Table added')
    },
    onError: (error: any) => {
      console.log(error)
      setError(error.response.data.error)
    },
  })

  if (!isAdmin) return <div>Not authorized</div>

  const handleSubmit = event => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const tableNumber = formData.get('tableNumber')
    loginMutation.mutate(tableNumber)
  }

  return (
    <div className="p-10">
      <form onSubmit={handleSubmit} className="mx-auto ">
        <input type="number" name="tableNumber" className="border-2 rounded-full" />
        <button type="submit">Add Table</button>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
      </form>
    </div>
  )
}
