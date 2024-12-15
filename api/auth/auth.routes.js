import express from 'express'

import { login, signup, logout, validateToken } from './auth.controller.js'

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.get('/validate-token', validateToken)
router.post('/validate-token', validateToken)


export const authRoutes = router