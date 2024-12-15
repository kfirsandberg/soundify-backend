import { stationService } from './station.service.js'
import { logger } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'
import { userService } from '../user/user.service.js'
import { authService } from '../auth/auth.service.js'

export async function getStations(req, res) {
    try {

        // const filterBy = {
        //     txt: req.query.txt || '',
        // }

        const stations = await stationService.query()
        res.send(stations)
    } catch (err) {
        // logger.error('Failed to get stations', err)
        res.status(500).send({ err: 'Failed to get stations' })
    }
}

export async function getStationById(req, res) {
    try {
        const stationId = req.params.stationId
        const station = await stationService.getById(stationId)
        res.send(station)
    } catch (err) {
        // logger.error('Failed to get station', err)
        res.status(500).send({ err: 'Failed to get station' })
    }
}

export async function addStation(req, res) {
    console.log('req:',req)
    var {loggedinUser} = req
    console.log('loggedinUser:',loggedinUser)
    try {
        const station = {
            "owner": {
                "external_urls": {
                    "spotify": "https://open.spotify.com/user/liked"
                },
                "display_name": "User"
            },
            "images": [
                {
                    "height": 640,
                    "width": 640,
                    "url": "https://res.cloudinary.com/dwzeothxl/image/upload/v1731394907/Screenshot_2024-11-12_085302_pmlaey.png"
                },
                {
                    "height": 300,
                    "width": 300,
                    "url": "https://res.cloudinary.com/dummyimage/liked_songs_small.png"
                },
                {
                    "height": 64,
                    "width": 64,
                    "url": "https://res.cloudinary.com/dummyimage/liked_songs_tiny.png"
                }
            ],
            "collaborative": false,
            "name": "my playlist #",
            "followers": {
                "href": null,
                "total": 0
            },
            "description": "",
            "tracks": []
        }
        const stationNum = req.params.stationNum
        console.log(stationNum);

        station.name = `My Playlist #${stationNum}`
        // toy.owner = loggedinUser
        const addedStation = await stationService.add(station)
        socketService.broadcast({ type: 'station-add', data: addedStation })

        res.send(addedStation)
    } catch (err) {
        res.status(500).send({ err: 'Failed to add station' })
    }
}

export async function updateStation(req, res) {
    try {
        const station = req.body
        const stationId = req.params.id

        // station.update = req.body
        station._id = stationId

        const updatedStation = await stationService.update(station)
        socketService.emitTo({ type: 'station-updated', data: updatedStation, label: updatedStation._id })
        res.send(updatedStation)
    } catch (err) {
        logger.error('Failed to update station', err)
        res.status(500).send({ err: 'Failed to update station' })
    }
}




export async function removeStation(req, res) {
    try {
        const stationId = req.params.id
        const deletedStation = await stationService.remove(stationId)
        socketService.broadcast({ type: 'station-remove', data: { id: stationId } })

        res.send(`${deletedStation} station removed`)
    } catch (err) {
        // logger.error('Failed to remove station', err)
        res.status(500).send({ err: 'Failed to remove station' })
    }
}
