import express from 'express'
import { search } from './youtube.controller.js'
const router = express.Router()


router.get('/search',search ) 


export const youtubeRoutes = router