import express from 'express'
import prisma from '../utils/prisma'
import bcrypt from 'bcrypt'

import jwt, { SignOptions } from 'jsonwebtoken'

const authRouter = express.Router()

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '60m' })
}

authRouter.get('/status', async (req, res) => {
  const cookie = req.headers.cookie
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    // Si no hay cookie, envía una respuesta de error.
    return res.json({ loggedIn: false })
  } else {
    // Si hay cookie, puedes realizar alguna otra acción o simplemente enviar una respuesta de éxito.

    return res.json({ loggedIn: true })
  }
})

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' })
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    })
    console.log('user', password, user.password)
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
    res
      .cookie(
        `auth:${user.id}`,
        true,
        { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 1000 * 60 * 60 * 24 * 7 * 3 },
        //
      )
      .send('Auth cookie set')
    const token = generateAccessToken(userForToken)
    res.json({ token: token, refreshToken: refreshToken })
  } catch (error) {
    console.log(error)
  }
})

authRouter.post('/register', async (req, res) => {
  const { username, password } = req.body
  console.log('username', username)
  const usernameExists = await prisma.user.findUnique({
    where: {
      username: username,
    },
  })
  console.log('usernameExists', usernameExists)
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

    res.status(200)
  } catch (error) {
    console.log(error)
  }
})

authRouter.post('/auth/logout', (req, res) => {
  let refreshTokens = []
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  Object.keys(req.cookies).forEach(cookie => {
    res.clearCookie(cookie)
  })
  res.sendStatus(204)
})

export default authRouter
