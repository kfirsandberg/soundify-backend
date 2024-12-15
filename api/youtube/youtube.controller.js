import {youtubeService} from './youtube.service.js'

export async function search(req,res){
    try {        
        const user = await youtubeService.searchYoutubeVideo(req.query.q)
        res.send(user)
    } catch (err) {
        res.status(400).send({ err: 'error:' })
    }
}