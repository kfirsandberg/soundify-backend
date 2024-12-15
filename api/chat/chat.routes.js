import express from 'express'
import { search, addStationWTracks } from './chat.controller.js'

const router = express.Router()

router.get('/send',search ) 
router.post('/send',addStationWTracks) 

export const chatRoutes = router