import express from 'express'
import { getArtists, getArtistById } from './artist.controller.js'

const router = express.Router()

router.get('/', getArtists)
router.get('/:artistId', getArtistById)

export const artistRoutes = router
