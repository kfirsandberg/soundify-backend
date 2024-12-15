import { ObjectId } from 'mongodb';
import { dbService } from '../../services/db.service.js';
import { logger } from '../../services/logger.service.js';


export const artistService = {
    query,
    getById,
    getArtistById,
};

async function query(filterBy = { txt: '' }) {
    try {
        const collection = await dbService.getCollection('station');
        const stations = await collection.find().toArray();

        const artists = [];

        // Collect all artists from tracks in stations
        for (const station of stations) {
            for (const trackObj of station.tracks) {
                const trackArtists = trackObj.track.artists;
                for (const artist of trackArtists) {
                    if (!artists.find((a) => a.id === artist.id)) {
                        artists.push(artist);
                    }
                }
            }
        }

        // Optionally filter by text
        if (filterBy.txt) {
            const regex = new RegExp(filterBy.txt, 'i');
            return artists.filter((artist) => regex.test(artist.name));
        }

        return artists;
    } catch (err) {
        logger.error('Failed to query artists', err);
        throw err;
    }
}

async function getById(stationId) {
    try {
        const collection = await dbService.getCollection('station');
        const station = await collection.findOne({ _id: new ObjectId(stationId) });

        if (!station) {
            throw new Error(`Station with ID ${stationId} not found`);
        }

        return station;
    } catch (err) {
        logger.error(`Error while finding station ${stationId}`, err);
        throw err;
    }
}

/**
 * Fetches artist details by their ID or name from the station's tracks.
 * Searches all stations for the requested artist.
 */
async function getArtistById(artistId) {
    try {
        const collection = await dbService.getCollection('station');
        const stations = await collection.find().toArray();
        let artist = null;
        let artistTracks = [];

        console.log('Fetching artist with ID or Name:', artistId);  

        // Loop through each station and check its tracks for the artist
        for (const station of stations) {
            for (const trackObj of station.tracks) {
                const track = trackObj.track;

                // Check if any of the artists in the track matches the artistId or artistName
                const matchingArtist = track.artists.find((artist) =>
                    artist.id === artistId || artist.name === artistId
                );

                if (matchingArtist) {
                    artist = matchingArtist;
                    artistTracks.push({
                        trackId: track.id,
                        trackName: track.name,
                        albumName: track.album.name,
                        albumReleaseDate: track.album.release_date,
                        durationMs: track.duration_ms,
                    });
                }
            }
        }

        if (!artist) {
            throw new Error(`Artist with ID or name ${artistId} not found`);
        }

        return {
            artist,
            tracks: artistTracks,
        };
    } catch (err) {
        logger.error(`Error while finding artist ${artistId}`, err);
        throw err;
    }
}
