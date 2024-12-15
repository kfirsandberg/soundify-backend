import {spotifyService} from './spotify.service.js'

export async function search(req,res){
    try {
        const user = await spotifyService.search(req.query.q)
        res.send(user)
    } catch (err) {
       
        res.status(400).send({ err: 'error:' })
    }
}
export async function searchSongs(req,res){
    try {
        const user = await spotifyService.searchSong(req.query.q)
        res.send(user)
    } catch (err) {
       
        res.status(400).send({ err: 'error:' })
    }
}

export async function getPlaylist(req,res){
    try {
        const user = await spotifyService.getPlaylistById(req.params.playlistId)
        res.send(user)
    } catch (err) {
        console.log(err);
        
        res.status(400).send({ err })
    }
}

export async function getArtist(req,res){      
    try {
        const user = await spotifyService.getArtistById(req.params.artistId)
        res.send(user)
    } catch (err) {
       
        res.status(400).send({ err: 'error:' })
    }
}