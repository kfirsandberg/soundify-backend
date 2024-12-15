import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { spotifyRoutes } from './api/spotify/spotify.routes.js'
import { artistRoutes } from './api/artsist/artist.routes.js'
import { youtubeRoutes } from './api/youtube/youtube.routes.js'
import { stationRoutes } from './api/stations/station.routes.js'
import { setupSocketAPI } from './services/socket.service.js'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'

import { savePlaylistData } from './spotify-data.js'

const app = express()
const server = http.createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())

// app.use('/api/youtube/song')

// app.use('/api/chat/search')

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:3030',
            'http://localhost:3030',
            'http://127.0.0.1:5174',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://localhost:5173',
        ],
        credentials: true
    }
    app.use(cors(corsOptions))
}
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/spotify', spotifyRoutes)
app.use('/api/youtube', youtubeRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/station', stationRoutes)
app.use('/api/artists', artistRoutes)


setupSocketAPI(server)

// Make every unhandled server-side-route match index.html
// so when requesting http://localhost:3030/unhandled-route... 
// it will still serve the index.html file
// and allow vue/react-router to take it from there

// app.get('/**', (req, res) => {
//     res.sendFile(path.resolve('public/index.html'))
// })

import { logger } from './services/logger.service.js'
import { chatRoutes } from './api/chat/chat.routes.js'
const port = process.env.PORT || 3030

server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
    // savePlaylistData('4V3K3JyGFBjgnjj3wwWH4f');
    // savePlaylistData('37i9dQZEVXbJ6IpvItkve3');
    // savePlaylistData('37i9dQZF1DWSYF6geMtQMW');
    // savePlaylistData('37i9dQZEVXbNG2KDcFcKOF');
    // savePlaylistData('2xHVoSjTKY6E0YIwggIon5');
    // savePlaylistData('37i9dQZEVXbLp5XoPON0wI');
    // savePlaylistData('37i9dQZEVXbLRQDuF5jeBp');
    // savePlaylistData('37i9dQZEVXbLiRSasKsNU9');
    // savePlaylistData('37i9dQZEVXbKuaTI1Z1Afx');
    // savePlaylistData('37i9dQZF1DWUa8ZRTfalHk');
    // savePlaylistData('37i9dQZF1DWV7EzJMK2FUI');
    // savePlaylistData('5ZBiA4R9h3CC3F2SJIhAm9');
    // savePlaylistData('37i9dQZF1DX1lHW2vbQwNN');


    // savePlaylistData('37i9dQZF1DX0wMD4IoQ5aJ');
    // savePlaylistData('37i9dQZF1DXcBWIGoYBM5M');
    // savePlaylistData('37i9dQZF1DWWQRwui0ExPn');
    // savePlaylistData('37i9dQZF1DX4SBhb3fqCJd');
    // savePlaylistData('37i9dQZF1DWTvNyxOwkztu');
    // savePlaylistData('37i9dQZF1DXcF6B6QPhFDv');
    // savePlaylistData('37i9dQZF1DX2M1RktxUUHG');
    // savePlaylistData('37i9dQZF1DX4WYpdgoIcn6');
    // savePlaylistData('37i9dQZF1DX4sWSpwq3LiO');
    // savePlaylistData('37i9dQZF1DWXRqgorJj26U');
    // savePlaylistData('37i9dQZF1E4wMmDGhc9aS2');
    // savePlaylistData('37i9dQZF1E4qSGMS0LCDb5');
    // savePlaylistData('37i9dQZF1E4rm3VpkGRopl');
    // savePlaylistData('37i9dQZF1E4muqTf5hDRcM');
    // savePlaylistData('37i9dQZF1E4wmWec21cCcJ');
})

