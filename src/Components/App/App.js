import React, { useState } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';

function App() {
  const [searchResults, setSearchResults] = useState(
    [
      // {
      //   name: 'MLK',
      //   artist: 'MLK',
      //   album: 'Hello World',
      //   id: 1
      // },
      // {
      //   name: 'Michael Jackson',
      //   artist: 'Billie Jean',
      //   album: 'Up',
      //   id: 2
      // },
      // {
      //   name: 'Revelation',
      //   artist: 'Dr. Dre',
      //   album: 'yup',
      //   id: 3
      // }
    ]
  );

  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistSongs, setPlaylistSongs] = useState(
    [
      // {
      //   name: 'Jordan',
      //   artist: 'Drake',
      //   album: 'Gods Plan',
      //   id: 4
      // },
      // {
      //   name: 'Galaxy',
      //   artist: 'Nintendo',
      //   album: 'Wii',
      //   id: 5
      // },
      // {
      //   name: 'Food',
      //   artist: 'Mother Nature',
      //   album: 'Life',
      //   id: 6
      // }
    ]
  );

  const addSong = (song) => {
    if (playlistSongs.find(savedSong => savedSong.id === song.id)) {
      return;
    }
    setPlaylistSongs((playlistSongs) => [...playlistSongs, song]);
  };

  const removeSong = (song) => {
    setPlaylistSongs((playlistSongs) => playlistSongs.filter(savedSong => savedSong.id !== song.id));
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylist = () => {
    let trackURIs = [];
    playlistSongs.forEach(playlistSong => {
      trackURIs.push(playlistSong.uri);
    });
    Spotify.savePlaylist(playlistName, trackURIs);
    setPlaylistSongs([]);
    setPlaylistName('New Playlist');
    setSearchResults([]);
  };

  const search = (term) => {
    Spotify.search(term).then(songs => setSearchResults(songs));
  };

  const luckySearch = (term) => {
    Spotify.search(term).then(songs => {
      if (songs) {
        const songChoice = songs[0];
        const songChoiceId = [songChoice.id];
        Spotify.getRecommendedSongs(songChoiceId).then((newSongs) => {
        setPlaylistSongs([songChoice, ...newSongs]);
        });
      }
    });
  };

  const shuffle = (songlist) => {
    return songlist.map(song => {
        return Spotify.getArtistSongs(song.artistID).then(songs => {
          let choice;
          do {
            choice = songs[Math.floor(Math.random()*songs.length)];
          } 
          while (choice.id === song.id);
          return choice;
        });
    });
  };

  const shufflePlaylist = (songlist) => {
    Promise.all(shuffle(songlist)).then((newSongs) => {
      setPlaylistSongs(newSongs);
    });
  }

  const randomizePlaylist = (songlist) => {
    const songIDList = songlist.map((song) => song.id);
    Spotify.getRecommendedSongs(songIDList).then((newSongs) => {
      setPlaylistSongs(newSongs);
    });
  }

  return (
    <div>
      <h1>YouStream</h1>
      <div className="App">
        <SearchBar onSearch={search} onLuckySearch={luckySearch} playlistSongs={playlistSongs}/> 
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} onAdd={addSong}/>
          <Playlist playlistName={playlistName} playlistSongs={playlistSongs} onRemove={removeSong} onNameChange={updatePlaylistName} onShuffle={shufflePlaylist} onRandomize={randomizePlaylist} onSave={savePlaylist}/>
        </div>
      </div>
    </div>
  );
}

export default App;
