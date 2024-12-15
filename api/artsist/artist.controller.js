import { artistService } from './artist.service.js';
import { logger } from '../../services/logger.service.js';
import { spotifyService } from '../spotify/spotify.service.js';


export async function getArtists(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
        };

        const artists = await artistService.query(filterBy); // Adjusting the function call
        res.send(artists);
    } catch (err) {
        logger.error('Failed to get artists', err);
        res.status(500).send({ err: 'Failed to get artists' });
    }
}

export async function getArtistById(req, res) {
    const { artistId } = req.params;
    console.log('Fetching artist with ID:', artistId);  // Log the artistId for debugging

    try {
        const artist = await spotifyService.getArtistById(artistId);  // Call the service
        if (!artist) {
            console.log('Artist not found');
            return res.status(404).send({ error: 'Artist not found' });
        }

        console.log('Artist data:', artist);  // Log the artist data for debugging
        res.send(artist);  // Send the artist data to the client
    } catch (err) {
        console.error('Error fetching artist:', err);  // Log detailed error
        res.status(500).send({ error: 'Failed to fetch artist' });
    }
}

