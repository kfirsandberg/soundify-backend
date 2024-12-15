import express from 'express'
import { getStations,getStationById,removeStation,addStation, updateStation } from './station.controller.js'
const router = express.Router()

router.get('/:stationId', getStationById)
router.get('/', getStations)
router.put('/:id/',updateStation)
router.post('/:stationNum',addStation)
router.delete('/:id/',removeStation )

export const stationRoutes = router