import { youtube_v3 } from '@googleapis/youtube';

export const youtubeService = {
    searchYoutubeVideo,
};

// אתחול ה-YouTube API עם ה-API Key שלך
const youtubeApi = new youtube_v3.Youtube({
    auth: process.env.YOUTUBE_KEY,
});

async function searchYoutubeVideo(query) {
    console.log(query);
    
    try {
        const response = await youtubeApi.search.list({
            part: 'snippet',
            q: query,
            maxResults: 1,
            type: 'video',
            videoEmbeddable: 'true',
        });


        if (response.data.items && response.data.items.length > 0) {
            const videoId = response.data.items[0].id.videoId;
            return videoId;
        } else {
            console.log('No videos found');
            return null;
        }
    } catch (err) {
        console.error('Error fetching video:', err);
        throw err;
    }
}
