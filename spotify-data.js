import fs from "fs";

import { spotifyService } from './api/spotify/spotify.service.js'

const dataFile = "./data-backup.json";

export async function savePlaylistData(id) {
    const playlistData = await spotifyService.getPlaylistById(id);
    if (!playlistData) return;

    let existingData = [];
    try {
        const fileContent = fs.readFileSync(dataFile, "utf-8");
        existingData = JSON.parse(fileContent);
    } catch (error) {
        console.warn("data.json not found, creating a new one.");
    }

    existingData.push(playlistData);

    fs.writeFileSync(dataFile, JSON.stringify(existingData, null, 2));
    console.log("Playlist data saved successfully!");
}


