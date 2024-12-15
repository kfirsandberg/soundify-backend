import { chatService } from './chat.service.js'
import { stationService } from '../stations/station.service.js'
import { spotifyService } from '../spotify/spotify.service.js'


export async function search(req, res) {
    try {
        const chatRes = await chatService.sendMessageToChatGPT(req.query.q)
        res.send(chatRes)
        
    } catch (err) {

        res.status(400).send({ err: 'error:' })
    }
}

export async function addStationWTracks(req, res) {
    try {     

        const tracks = await Promise.all(
            req.body.map(async (track) => {
                try {
                    const searchQuery = `${track.title} ${track.artist}`;
                    return await spotifyService.searchSong(searchQuery);
                } catch (err) {
                    console.error(`Error fetching song details for ${track.name}:`, err);
                    return null;
                }
            })
        );
        const validTracks = tracks.filter((track) => track !== null);
        const formattedResponse = {
            owner: {
                external_urls: {
                    spotify: "https://open.spotify.com/user/liked",
                },
                display_name: "User",
            },
            images: [
                {
                    height: 640,
                    width: 640,
                    url: "https://res.cloudinary.com/dhzo7e3yx/image/upload/v1732191177/ai_erhsj4.webp",
                },
                {
                    height: 300,
                    width: 300,
                    url: "https://res.cloudinary.com/dummyimage/liked_songs_small.png",
                },
                {
                    height: 64,
                    width: 64,
                    url: "https://res.cloudinary.com/dummyimage/liked_songs_tiny.png",
                },
            ],
            collaborative: false,
            name: "AI playlist:",
            followers: {
                href: null,
                total: 0,
            },
            description: "",
            tracks: validTracks,
        }
        const addedStation = await stationService.add(formattedResponse)
        res.send(addedStation)
    } catch (err) {
        res.status(500).send({ err: 'Failed to add station' })
    }
}

