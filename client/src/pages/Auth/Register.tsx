import instance from '@/axiosConfig'
import { Button } from '@/components/Button'
import Form from '@/components/Form'
import { Field } from '@/components/Forms/Field'
import { emailSchema, passwordSchema, usernameSchema } from '@/utils/user-validations'
import React, { useState } from 'react'
import { json, redirect, useActionData, useLocation, useNavigation } from 'react-router-dom'
import { z } from 'zod'

const RegisterSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
})

export async function action({ request, params }) {
  const formData = Object.fromEntries(await request.formData())
  try {
    const res = await instance.post('/v1/auth/register', {
      withCredentials: true,
      username: formData.username,
      password: formData.password,
    })
    console.log(res)
  } catch (e) {
    return json({ res: { error: 'Error desconocido' } }, { status: 500 })
  }
}

const Register = () => {
  const navigation = useNavigation()
  const location = useLocation()
  const isSubmitting = navigation.state !== 'idle'
  const actionData = useActionData() as { res: any }

  return (
    <div>
      <h1>Register</h1>
      <Form validator={RegisterSchema}>
        {(register, errors) => (
          <>
            <Field
              labelProps={{ children: 'Usuario' }}
              inputProps={{
                placeholder: 'Usuario...',
                name: 'username',
                type: 'username',
                ...register('username'),
              }}
              errors={errors.username?.message || actionData?.res?.error}
            />
            <Field
              labelProps={{ children: 'Contraseña' }}
              inputProps={{
                placeholder: 'Contraseña...',
                name: 'password',
                type: 'password',
                ...register('password'),
              }}
              errors={errors.password?.message}
            />
            <Button type="submit" className="p-2 bg-blue-400 border" disabled={isSubmitting} text="send" />
          </>
        )}
      </Form>
    </div>
  )
}

export default Register
