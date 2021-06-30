import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';
// import $ from 'jquery'; 

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

  let steps;

  useEffect(() => {
    // Update the document title using the browser API
    steps = Array.from(document.querySelectorAll(".modal .step"));
    const nextBtn = document.querySelectorAll(".modal .next-btn");
    const prevBtn = document.querySelectorAll(".modal .previous-btn");
    const modal = document.querySelector(".modal");
    
    nextBtn.forEach((button) => {
      button.addEventListener("click", () => {
        changeStep("next");
      });
    });
    prevBtn.forEach((button) => {
      button.addEventListener("click", () => {
        changeStep("prev");
      });
    });
    
    modal.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputs = [];
      modal.querySelectorAll("input").forEach((input) => {
        const { name, value } = input;
        inputs.push({ name, value });
      });
      modal.reset();
    });
    

    
  });

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

  const clientID = process.env.REACT_APP_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  const redirectURI = process.env.REACT_APP_REDIRECT_URI;

  //Display "+" if track is not in the playlist
  //Display "-" if track is in the playlist
  
  let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/) ? true : false;
  console.log(accessTokenMatch);

  const logIn = () => {
    Spotify.getAccessToken().then(
      accessTokenMatch = window.location.href.match(/access_token=([^&]*)/) ? true : false
    );

  };
    
  const logInAction = boolean => {
    console.log(boolean);
    if (!boolean) {
        console.log('not logged in, please log in');
        return (
          <div className="navBtnContainer" onClick={logIn}>
            <img alt="Spotify" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+U3BvdGlmeV9JY29uX1JHQl9HcmVlbjwvdGl0bGU+PHBhdGggZD0iTTE1LjU4OCA5LjA5NEMxMi40MyA3LjIyIDcuMjIzIDcuMDQ3IDQuMjA4IDcuOTZjLS40ODMuMTQ4LS45OTQtLjEyNS0xLjE0LS42MS0uMTQ4LS40ODMuMTI1LS45OTUuNjEtMS4xNDIgMy40Ni0xLjA1IDkuMjEtLjg0NyAxMi44NDUgMS4zMS40MzYuMjYuNTguODIuMzIgMS4yNTYtLjI1OC40MzUtLjgyLjU4LTEuMjU1LjMyem0tLjEwMyAyLjc3N2MtLjIyMi4zNi0uNjkyLjQ3My0xLjA1LjI1My0yLjYzMy0xLjYxOC02LjY0Ni0yLjA4Ny05Ljc2LTEuMTQyLS40MDQuMTIzLS44My0uMTA0LS45NTMtLjUwOC0uMTIyLS40MDMuMTA2LS44My41MS0uOTUyIDMuNTU2LTEuMDggNy45OC0uNTU3IDExLjAwMiAxLjMuMzYuMjIyLjQ3Mi42OTMuMjUgMS4wNXptLTEuMiAyLjY2OGMtLjE3NS4yOS0uNTUuMzgtLjgzOC4yMDMtMi4zLTEuNDA0LTUuMTk1LTEuNzIyLTguNjA0LS45NDMtLjMzLjA3NS0uNjU2LS4xMy0uNzMtLjQ2LS4wNzctLjMyOC4xMy0uNjU1LjQ1OC0uNzMgMy43MzItLjg1MyA2LjkzMi0uNDg2IDkuNTE0IDEuMDkyLjI4OC4xNzQuMzc4LjU1LjIwMi44Mzh6TTkuNzk2LjQxQzQuMzg1LjQxIDAgNC43OTcgMCAxMC4yMDYgMCAxNS42MTUgNC4zODUgMjAgOS43OTUgMjBzOS43OTQtNC4zODUgOS43OTQtOS43OTVTMTUuMjAzLjQxIDkuNzk0LjQxeiIgZmlsbD0iIzREQjA1QiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+" id="spotifyImg"/><span>Connect with Spotify</span>
          </div>
            // <button className="Playlist-button" onClick={logIn}>Log In</button>
        )
    }

    console.log('already logged in');
    return (
        <button className="Playlist-button" disabled>Logged in</button>
    );

  };

  const openModal = e => {
    const app = e.target.parentElement;
    const modal = app.querySelector('.modal');
    const overlay = app.querySelector('#overlay');

    modal.classList.add('active');
    overlay.classList.add('active');
    
    overlay.addEventListener('click', closeModal);
  }

  const closeModal = e => {
    const app = e.target.closest('.App');
    const modal = app.querySelector('.modal');
    const overlay = app.querySelector('#overlay');

    modal.classList.remove('active');
    overlay.classList.remove('active');
  }

  const changeStep = btn => {
    let index = 0;
    const active = document.querySelector(".step.active");
    index = steps.indexOf(active);
    steps[index].classList.remove("active");
    if (btn === "next") {
      index++;
    } else if (btn === "prev") {
      index--;
    }
    steps[index].classList.add("active");
  }

  return (
    <div>
      <h1>YouStream</h1>
      <div className="App">
        <button type="button" className="Playlist-button" data-toggle="modal" data-target="#myModal" id="myBtn" onClick={openModal}>Tutorial</button>

        <div className="modal fade" id="myModal">
          <div className="step step-1 active">
            <div className="step-header">1/4</div>
            <div className="form-group">
              <h1>Welcome to YouStream!</h1>
              <h2>This tutorial will walk you through all of the features of this application.</h2>
              <h3>If you want to skip the tutorial, feel free to click anywhere outside the tutorial. Else, press "Next"!</h3>
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" name="last-name"/>
            </div>
            <div className="form-group">
              <label htmlFor="nickName">Nick Name</label>
              <input type="text" id="nickName" name="nick-name"/>
            </div>
            <div className="step-footer">
              <button type="button" className="next-btn">Next</button>
            </div>
          </div>

          <div className="step step-2">
          <div className="step-header">2/4</div>
            <div className="form-group">
              <h1>What is YouStream?</h1>
              <h2>YouStream is an application designed for Spotify users to create their own song playlists and save them to their account.</h2>
              <h3>This means you need to be a Spotify user to use this application!</h3>
              <h3>If you have an account, begin by clicking the "Connect to Spotify" button in the top right corner.</h3>
              <label htmlFor="email">Email</label>
              <input type="text" id="email" name="email"/>
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input type="number" id="phone" name="phone-number"/>
            </div>
            <div className="step-footer">
              <button type="button" className="previous-btn">Prev</button>
              <button type="button" className="next-btn">Next</button>
            </div>
          </div>

          <div className="step step-3">
          <div className="step-header">3/4</div>
            <div className="form-group">
              <h1>Picking the Songs</h1>
              <h2>Type an song, album, or artist in the search bar.</h2>
              <h3>Clicking the "Search" button will add the results to the "Results" list.</h3>
              <h3>Clicking the "I'm Feeling Lucky" button will automatically generate a playlist of seven songs based on the search bar input.</h3>
              <label htmlFor="email">Email</label>
              <input type="text" id="email" name="email"/>
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input type="number" id="phone" name="phone-number"/>
            </div>
            <div className="step-footer">
              <button type="button" className="previous-btn">Prev</button>
              <button type="button" className="next-btn">Next</button>
            </div>
          </div>

          <div className="step step-4">
            <div className="step-header">4/4</div>
            <div className="form-group">
              <h1>Picking the Songs</h1>
              <h2>Type an song, album, or artist in the search bar.</h2>
              <h3>Clicking the "Search" button will </h3>
              <h3>If you have an account, begin by clicking the "Connect to Spotify" in the top right corner.</h3>
              <label htmlFor="country">country</label>
              <input type="text" id="country" name="country"/>
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city"/>
            </div>
            <div className="form-group">
              <label htmlFor="postCode">Post Code</label>
              <input type="text" id="postCode" name="post-code"/>
            </div>
            <div className="step-footer">
              <button type="button" className="previous-btn">Prev</button>
              <button type="submit" className="submit-btn">Submit</button>
            </div>
          </div>
        </div>
        
        {logInAction(accessTokenMatch)}
        
        {/* <div class="navBtnContainer">
          <a class="navBtnText" href={`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&redirect_uri=${redirectURI}&scope=playlist-modify-public`}><img alt="Spotify" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+U3BvdGlmeV9JY29uX1JHQl9HcmVlbjwvdGl0bGU+PHBhdGggZD0iTTE1LjU4OCA5LjA5NEMxMi40MyA3LjIyIDcuMjIzIDcuMDQ3IDQuMjA4IDcuOTZjLS40ODMuMTQ4LS45OTQtLjEyNS0xLjE0LS42MS0uMTQ4LS40ODMuMTI1LS45OTUuNjEtMS4xNDIgMy40Ni0xLjA1IDkuMjEtLjg0NyAxMi44NDUgMS4zMS40MzYuMjYuNTguODIuMzIgMS4yNTYtLjI1OC40MzUtLjgyLjU4LTEuMjU1LjMyem0tLjEwMyAyLjc3N2MtLjIyMi4zNi0uNjkyLjQ3My0xLjA1LjI1My0yLjYzMy0xLjYxOC02LjY0Ni0yLjA4Ny05Ljc2LTEuMTQyLS40MDQuMTIzLS44My0uMTA0LS45NTMtLjUwOC0uMTIyLS40MDMuMTA2LS44My41MS0uOTUyIDMuNTU2LTEuMDggNy45OC0uNTU3IDExLjAwMiAxLjMuMzYuMjIyLjQ3Mi42OTMuMjUgMS4wNXptLTEuMiAyLjY2OGMtLjE3NS4yOS0uNTUuMzgtLjgzOC4yMDMtMi4zLTEuNDA0LTUuMTk1LTEuNzIyLTguNjA0LS45NDMtLjMzLjA3NS0uNjU2LS4xMy0uNzMtLjQ2LS4wNzctLjMyOC4xMy0uNjU1LjQ1OC0uNzMgMy43MzItLjg1MyA2LjkzMi0uNDg2IDkuNTE0IDEuMDkyLjI4OC4xNzQuMzc4LjU1LjIwMi44Mzh6TTkuNzk2LjQxQzQuMzg1LjQxIDAgNC43OTcgMCAxMC4yMDYgMCAxNS42MTUgNC4zODUgMjAgOS43OTUgMjBzOS43OTQtNC4zODUgOS43OTQtOS43OTVTMTUuMjAzLjQxIDkuNzk0LjQxeiIgZmlsbD0iIzREQjA1QiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+" id="spotifyImg"/><span class="_1BOC1e8tx5AhHF_ehsVixH">Connect with Spotify</span>
          </a>
        </div> */}
        <SearchBar onSearch={search} onLuckySearch={luckySearch} playlistSongs={playlistSongs}/>
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} onAdd={addSong}/>
          <Playlist playlistName={playlistName} playlistSongs={playlistSongs} onRemove={removeSong} onNameChange={updatePlaylistName} onShuffle={shufflePlaylist} onRandomize={randomizePlaylist} onSave={savePlaylist}/>
        </div>

        <div id="overlay"></div>
      </div>
    </div>
  );
}

export default App;
