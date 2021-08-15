const clientID = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirectURI = process.env.REACT_APP_REDIRECT_URI;

let accessToken;
let expiresIn;

const Spotify = {
    getAccessToken() {
        const origHeader = btoa(`${clientID}:${clientSecret}`);

        return fetch(`https://accounts.spotify.com/api/token?grant_type=client_credentials`,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${origHeader}`
                },
            } 
        ).then(response => response.json()).then(jsonResponse => {
            return [jsonResponse.access_token, jsonResponse.expires_in];
        })
    },

    getUserAccessToken() {
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        expiresIn = expiresInMatch ? expiresInMatch[1] : null;
        expiresIn = expiresIn || 3600;

        let expiresAt = sessionStorage.getItem('user_expires_at');
        if (!expiresAt) {
        expiresAt = Date.now() + Number(expiresIn) * 1000;
        sessionStorage.setItem('user_expires_at', expiresAt);
        }

        if (Date.now() > expiresAt) {
        sessionStorage.removeItem('user_expires_at');
        }

        if (accessToken && (Date.now() < expiresAt)) {
            return accessToken;
        }

        if (accessTokenMatch) {
            window.history.pushState('Access Token', null, '/');
            return accessTokenMatch[1];
        }

        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&redirect_uri=${redirectURI}&scope=playlist-modify-public`;
        window.location = accessUrl;
        
    },

    search(TERM, token) {
        TERM = TERM.replace(' ', '%20');

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${TERM}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        ).then(response => response.json()).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                artistID: track.artists[0].id,
                album: track.album.name,
                uri: track.uri,
                imageUrl: track.album.images[2].url
            }));
        });
    },

    getArtistSongs(id, token) {
        return fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?country=US`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        ).then(response => response.json()).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                artistID: track.artists[0].id,
                album: track.album.name,
                uri: track.uri,
                imageUrl: track.album.images[2].url
            }));
        });

    },

    getRecommendedSongs(songIDList, token) {
        let queryStringParams = '?seed_tracks=';
        queryStringParams += songIDList.join(',');
        queryStringParams += '&limit=7';

        return fetch(`https://api.spotify.com/v1/recommendations${queryStringParams}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        ).then(response => response.json()).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                artistID: track.artists[0].id,
                album: track.album.name,
                uri: track.uri,
                imageUrl: track.album.images[2].url
            }));
        });
    },

    savePlaylist(playlistName, trackURIs, token) {

        if (!(playlistName && trackURIs)) {
            return;
        } 

        const headers = {
            Authorization: `Bearer ${token}`
        };
        let userID;

        return fetch('https://api.spotify.com/v1/me', {
            headers: headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: playlistName })
        }).then(response => response.json())
        .then(jsonResponse => {
            const playlistId = jsonResponse.id;
            return fetch(
            `https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackURIs })
            });
        });
    });
    }
    
};

export default Spotify;