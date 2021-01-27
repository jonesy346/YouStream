const clientID = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirectURI = process.env.REACT_APP_REDIRECT_URI;

let accessToken;
let expiresIn;

const Spotify = {
    getAccessToken() {
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        expiresIn = expiresInMatch ? expiresInMatch[1] : null;
        expiresIn = expiresIn || 3600;

        let expiresAt = sessionStorage.getItem('expires_at');
        if (!expiresAt) {
        expiresAt = Date.now() + Number(expiresIn) * 1000;
        sessionStorage.setItem('expires_at', expiresAt);
        }

        if (Date.now() > expiresAt) {
        sessionStorage.removeItem('expires_at');
        }

        if (accessToken && (Date.now() < expiresAt)) {
        return accessToken;
        }

        accessToken = accessTokenMatch ? accessTokenMatch[1] : null;

        if (accessToken) {
        window.history.pushState('Access Token', null, '/');
        return accessToken;
        }

        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&redirect_uri=${redirectURI}&scope=playlist-modify-public`;
        window.location = accessUrl;
    },

    search(TERM) {
        accessToken = Spotify.getAccessToken();
        TERM = TERM.replace(' ', '%20');

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${TERM}`, 
            {
                headers: {Authorization: `Bearer ${accessToken}`}
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

    getArtistSongs(id) {
        accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?country=US`, 
            {
                headers: {Authorization: `Bearer ${accessToken}`}
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

    getRecommendedSongs(songIDList) {
        accessToken = Spotify.getAccessToken();
        let queryStringParams = '?seed_tracks=';
        queryStringParams += songIDList.join(',');
        queryStringParams += '&limit=7';

        // update the access token logic to expire at exactly the right time, instead of setting expiration from when the user initiates their next search
        // after user redirect on login, restoring the search term from before the redirect
        // ensure playlist information doesn't get cleared if a user has to refresh their access token

        console.log(accessToken);
        return fetch(`https://api.spotify.com/v1/recommendations${queryStringParams}`, 
            {
                headers: {Authorization: `Bearer ${accessToken}`}
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

    savePlaylist(playlistName, trackURIs) {
        if (!(playlistName && trackURIs)) {
            return;
        } 
        accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
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