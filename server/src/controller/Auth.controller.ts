import bcrypt from 'bcrypt'
import prisma from '../utils/prisma'

import jwt from 'jsonwebtoken'
import { generateAccessToken } from '../utils/auth'

const getAuthStatus = async (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    // Si no hay cookie, envía una respuesta de error.
    return res.json({ loggedIn: false })
  } else {
    // Si hay cookie, puedes realizar alguna otra acción o simplemente enviar una respuesta de éxito.

    return res.json({ loggedIn: true })
  }
}

const authLogin = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' })
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    })

    if (!user) return res.status(400).json({ error: 'Username not found' })
    if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ error: 'Password is wrong' })
    const userForToken = {
      id: user.id,
      username: user.username,
    }

    const refreshToken = jwt.sign(userForToken, process.env.REFRESH_TOKEN_SECRET)

    try {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          token: refreshToken,
        },
      })
    } catch (error) {
      console.log('Error al actualizar el token')
    }

    res.cookie(
      'refreshToken',
      refreshToken,

      { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 1000 * 60 * 60 * 24 * 7 },
    )
    res.cookie(
      `auth:${user.id}`,
      true,
      { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 1000 * 60 * 60 * 24 * 7 * 3 },
      //
    )

    const token = generateAccessToken(userForToken)
    console.log(`🧑🏼‍💻 ${username} inicio sesion`)
    return res.json({ token: token, refreshToken: refreshToken, user: user })
  } catch (error) {
    console.log(error)
  }
}

const authRegister = async (req, res) => {
  const { username, password } = req.body
  console.log('username', username)
  const usernameExists = await prisma.user.findUnique({
    where: {
      username: username,
    },
  })

  if (usernameExists) return res.status(400).json({ error: 'Username already exists' })

  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' })
  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = await prisma.user.create({
      data: {
        username: username,
        password: passwordHash,
      },
    })
    res.cookie(`auth:${user.id}`, true, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 1000 * 60 * 60 * 24 * 7 * 3 })

    res.json(user)
  } catch (error) {
    console.log(error)
  }
}

const authLogout = (req, res) => {
  let refreshTokens = []
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)

  Object.keys(req.cookies).forEach(cookie => {
    res.clearCookie(cookie)
  })
  res.sendStatus(204)
}
export { authLogin, authLogout, authRegister, getAuthStatus }
