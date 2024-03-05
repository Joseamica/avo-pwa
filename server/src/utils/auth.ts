import jwt, { SignOptions } from 'jsonwebtoken'

export function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '60m' })
}
