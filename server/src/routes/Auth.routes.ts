import express from 'express'
import { authLogin, authLogout, authRegister, getAuthStatus } from '../controller/Auth.controller'

const authRouter = express.Router()

authRouter.get('/status', getAuthStatus)
authRouter.post('/login', authLogin)
authRouter.post('/register', authRegister)
authRouter.post('/logout', authLogout)

export default authRouter
