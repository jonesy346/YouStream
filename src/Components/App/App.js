import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';
import swal from 'sweetalert';

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

  const [playlistName, setPlaylistName] = useState('');
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

  const [counterList, setCounterList] = useState([]);
  const [storageCounter, setStorageCounter] = useState(0);
  const [accessToken, setAccessToken] = useState(''); 
  const [userAccessToken, setUserAccessToken] = useState('');

  let steps;
  
  const myStorage = window.sessionStorage;
  

  useEffect(() => {
    steps = Array.from(document.querySelectorAll(".modal .step"));
    const nextBtn = document.querySelectorAll(".modal .next-btn");
    const prevBtn = document.querySelectorAll(".modal .previous-btn");
    const closeBtn = document.querySelector(".modal .submit-btn");
    
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

    closeBtn.addEventListener("click", closeModal);

    // get accessToken on my server
    Spotify.getAccessToken().then(res => {
      setAccessToken(res[0]);
      const expiresAt = Date.now() + Number(res[1]) * 1000;
      sessionStorage.setItem('expires_at', expiresAt);
    });

  }, []);

  useEffect(() => {
    if ((counterList.length === 0 || storageCounter === 0) && myStorage.getObj('counterList') && myStorage.getObj('counterList').length !== 0) {
      setStorageCounter(myStorage.getObj('counterList')[myStorage.getObj('counterList').length - 1]);
      setCounterList(myStorage.getObj('counterList'));
      setPlaylistSongs(myStorage.getObj(myStorage.getObj('counterList')[myStorage.getObj('counterList').length - 1]));
    } 
    
    else if (counterList.length !== 0 && myStorage.getObj(storageCounter) && storageCounter !== myStorage.getObj('counterList')[myStorage.getObj('counterList').length - 1] && !arraysEqual(playlistSongs, myStorage.getObj(storageCounter))) {
      for (let i = storageCounter; i < myStorage.getObj('counterList').length + 1; i++) {
        myStorage.removeItem(i);
      }
      setCounterList(myStorage.getObj('counterList').slice(0, storageCounter));
      myStorage.setObj('counterList', myStorage.getObj('counterList').slice(0, storageCounter));
    } 
    
    else if (counterList.length !== 0 && playlistSongs.length === 0) {
      myStorage.setObj('counterList', counterList);
      myStorage.setObj(storageCounter, playlistSongs);
    }   

    else if (playlistSongs.length !== 0) {
      myStorage.setObj('counterList', counterList);
      myStorage.setObj(storageCounter, playlistSongs);
    } 

    if (window.location.href.match(/access_token=([^&]*)/) || window.location.href.match(/expires_in=([^&]*)/)) {
      setUserAccessToken(window.location.href.match(/access_token=([^&]*)/)[1]);
      window.history.pushState('Access Token', null, '/');
    }

  });

  const objectsEqual = (o1, o2) => {
    return Object.keys(o1).length === Object.keys(o2).length && Object.keys(o1).every(p => o1[p] === o2[p]);
  }

  const arraysEqual = (a1, a2) => {
    return a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
  }

  const addSong = (song) => {
    if (playlistSongs.find(savedSong => savedSong.id === song.id)) {
      return;
    }
    setPlaylistSongs((playlistSongs) => [...playlistSongs, song]);
    setCounterList(counterList => [...counterList, storageCounter + 1]);
    setStorageCounter(storageCounter => storageCounter + 1);
  };

  const removeSong = (song) => {
    setPlaylistSongs((playlistSongs) => playlistSongs.filter(savedSong => savedSong.id !== song.id));
    setCounterList(counterList => [...counterList, storageCounter + 1]);
    setStorageCounter(storageCounter => storageCounter + 1);
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylist = () => {
    if (playlistSongs.length === 0) {
      swal('Oops!', 'Playlist is empty', "error");
      return;
    } else if (!playlistName) {
      swal('Oops!', 'Please type a playlist name', "error");
      return;
    } else if (!userAccessToken || Date.now() >= sessionStorage.getItem('user_expires_at')) {
      setUserAccessToken(Spotify.getUserAccessToken());
      return;
    }

    let trackURIs = [];
    playlistSongs.forEach(playlistSong => {
      trackURIs.push(playlistSong.uri);
    });
    Spotify.savePlaylist(playlistName, trackURIs);
    setPlaylistSongs([]);
    setPlaylistName('New Playlist');
    setSearchResults([]);
    setCounterList(counterList => [...counterList, storageCounter + 1]);
    setStorageCounter(storageCounter => storageCounter + 1);

    swal("Success!", "Your playlist has been downloaded to Spotify", "success");
  };

  const search = (term) => {
    if (!accessToken || Date.now() >= sessionStorage.getItem('expires_at')) {
      Spotify.getAccessToken().then(res => {
        setAccessToken(res[0]);
        const expiresAt = Date.now() + Number(res[1]) * 1000;
        sessionStorage.setItem('expires_at', expiresAt);
      });
    }

    Spotify.search(term, accessToken).then(songs => setSearchResults(songs));
  };

  const luckySearch = (term) => {
    if (!accessToken || Date.now() >= sessionStorage.getItem('expires_at')) {
      Spotify.getAccessToken().then(res => {
        setAccessToken(res[0]);
        const expiresAt = Date.now() + Number(res[1]) * 1000;
        sessionStorage.setItem('expires_at', expiresAt);
      });
    }

    Spotify.search(term, accessToken).then(songs => {
      if (songs) {
        const songChoice = songs[0];
        const songChoiceId = [songChoice.id];
        Spotify.getRecommendedSongs(songChoiceId, accessToken).then((newSongs) => {
          setPlaylistSongs([songChoice, ...newSongs]);
          setCounterList(counterList => [...counterList, storageCounter + 1]);
          setStorageCounter(storageCounter => storageCounter + 1);
        });
      }
    });
  };

  const shuffle = (songlist) => {
    if (!accessToken || Date.now() >= sessionStorage.getItem('expires_at')) {
      Spotify.getAccessToken().then(res => {
        setAccessToken(res[0]);
        const expiresAt = Date.now() + Number(res[1]) * 1000;
        sessionStorage.setItem('expires_at', expiresAt);
      });
    }

    // could add something to check for artist lists having only one song

    let newList = [];
    return songlist.map(song => {
      return Spotify.getArtistSongs(song.artistID, accessToken).then(songs => {
        if (songs.length === 1) {
          newList.push(songs[0]);
          return songs[0];
        }

        let choice;
        do {
          choice = songs[Math.floor(Math.random()*songs.length)];
        } 
        while (choice.id === song.id || newList.find(element => element.id === choice.id));
        newList.push(choice);
        return choice;
      });
    });
  };

  const shufflePlaylist = (songlist) => {
    Promise.all(shuffle(songlist)).then((newSongs) => {
      setPlaylistSongs(newSongs);
      setCounterList(counterList => [...counterList, storageCounter + 1]);
      setStorageCounter(storageCounter => storageCounter + 1);
    });
  }

  const randomizePlaylist = (songlist) => {
    if (!accessToken || Date.now() >= sessionStorage.getItem('expires_at')) {
      Spotify.getAccessToken().then(res => {
        setAccessToken(res[0]);
        const expiresAt = Date.now() + Number(res[1]) * 1000;
        sessionStorage.setItem('expires_at', expiresAt);
      });
    }

    const songIDList = songlist.map((song) => song.id);
    Spotify.getRecommendedSongs(songIDList, accessToken).then((newSongs) => {
      setPlaylistSongs(newSongs);
      setCounterList(counterList => [...counterList, storageCounter + 1]);
      setStorageCounter(storageCounter => storageCounter + 1);
    });
  }

  const logIn = () => {
    setUserAccessToken(Spotify.getUserAccessToken());
  };

  const logOut = () => {
    setUserAccessToken('');
  }
    
  const logInAction = boolean => {
    if (!boolean) {
        return (
          <div className="navBtnContainer" onClick={logIn}>
            <img alt="Spotify" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+U3BvdGlmeV9JY29uX1JHQl9HcmVlbjwvdGl0bGU+PHBhdGggZD0iTTE1LjU4OCA5LjA5NEMxMi40MyA3LjIyIDcuMjIzIDcuMDQ3IDQuMjA4IDcuOTZjLS40ODMuMTQ4LS45OTQtLjEyNS0xLjE0LS42MS0uMTQ4LS40ODMuMTI1LS45OTUuNjEtMS4xNDIgMy40Ni0xLjA1IDkuMjEtLjg0NyAxMi44NDUgMS4zMS40MzYuMjYuNTguODIuMzIgMS4yNTYtLjI1OC40MzUtLjgyLjU4LTEuMjU1LjMyem0tLjEwMyAyLjc3N2MtLjIyMi4zNi0uNjkyLjQ3My0xLjA1LjI1My0yLjYzMy0xLjYxOC02LjY0Ni0yLjA4Ny05Ljc2LTEuMTQyLS40MDQuMTIzLS44My0uMTA0LS45NTMtLjUwOC0uMTIyLS40MDMuMTA2LS44My41MS0uOTUyIDMuNTU2LTEuMDggNy45OC0uNTU3IDExLjAwMiAxLjMuMzYuMjIyLjQ3Mi42OTMuMjUgMS4wNXptLTEuMiAyLjY2OGMtLjE3NS4yOS0uNTUuMzgtLjgzOC4yMDMtMi4zLTEuNDA0LTUuMTk1LTEuNzIyLTguNjA0LS45NDMtLjMzLjA3NS0uNjU2LS4xMy0uNzMtLjQ2LS4wNzctLjMyOC4xMy0uNjU1LjQ1OC0uNzMgMy43MzItLjg1MyA2LjkzMi0uNDg2IDkuNTE0IDEuMDkyLjI4OC4xNzQuMzc4LjU1LjIwMi44Mzh6TTkuNzk2LjQxQzQuMzg1LjQxIDAgNC43OTcgMCAxMC4yMDYgMCAxNS42MTUgNC4zODUgMjAgOS43OTUgMjBzOS43OTQtNC4zODUgOS43OTQtOS43OTVTMTUuMjAzLjQxIDkuNzk0LjQxeiIgZmlsbD0iIzREQjA1QiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+" id="spotifyImg"/><span>Connect to Spotify</span>
          </div>
        )
    }

    return (
        <button className="Playlist-button" onClick={logOut}>Log out</button>
    );
  };

  const openModal = e => {
    const app = e.target.closest('.App');
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

  const playlistNavLeft = () => {
    if (myStorage.getObj('counterList') && myStorage.getObj('counterList').length !== 0 && storageCounter >= 2) {
      setPlaylistSongs(myStorage.getObj(storageCounter - 1));
      setStorageCounter(storageCounter => storageCounter - 1);
    }
  }

  const playlistNavRight = () => {
    if (myStorage.getObj('counterList') && myStorage.getObj('counterList').length !== 0 && storageCounter <= myStorage.getObj('counterList').length - 1) {
      setPlaylistSongs(myStorage.getObj(storageCounter + 1));
      setStorageCounter(storageCounter => storageCounter + 1);

    }
  }

  return (
    <div>
      <h1>YouStream</h1>
      <div className="App">
        <div className="navBtnsContainer">
          <button type="button" className="tutorial-button" data-toggle="modal" data-target="#myModal" id="myBtn" onClick={openModal}>Tutorial</button>
          {logInAction(userAccessToken)}
        </div>

        <div className="modal fade" id="myModal">
          <div className="step step-1 active">
            <div className="step-header">1/6</div>
            <div className="form-group">
              <h1>Welcome to YouStream!</h1>
              <h2>This tutorial will walk you through all of the features of this application.</h2>
              <h3>If you want to skip the tutorial, feel free to click anywhere outside the tutorial. Else, press "Next"!</h3>
            </div>
            
            <div className="step-footer">
              <div className="footer-btn">
                <button type="button" className="next-btn">Next</button>
              </div>
            </div>
          </div>

          <div className="step step-2">
          <div className="step-header">2/6</div>
            <div className="form-group">
              <h1>What is YouStream?</h1>
              <h2>YouStream is an application designed for users to create song playlists and save them to their Spotify accounts.</h2>
              <h3>If you don't have an account, you can still search for songs and create your own playlists but can't save them.</h3> 
              <h3>If you have an account, begin by clicking the "Connect to Spotify" button in the top right corner.</h3>  
            </div>
            
            <div className="step-footer">
              <div className="footer-btn">
                <button type="button" className="previous-btn">Prev</button>
                <button type="button" className="next-btn">Next</button>
              </div>
            </div>
          </div>

          <div className="step step-3">
          <div className="step-header">3/6</div>
            <div className="form-group">
              <h1>Picking the Songs</h1>
              <h2>Type an song, album, or artist in the search bar.</h2>
              <h3>Clicking the "Search" button will add the results to the "Results" list.</h3>
              <h3>Clicking the "I'm Feeling Lucky" button will automatically generate a tracklist of seven songs based on the search bar input that can then be modified or saved.</h3>
            </div>
            
            <div className="step-footer">
              <div className="footer-btn">
                <button type="button" className="previous-btn">Prev</button>
                <button type="button" className="next-btn">Next</button>
              </div>
            </div>
          </div>

          <div className="step step-4">
          <div className="step-header">4/6</div>
            <div className="form-group">
              <h1>From Search Results to Playlist</h1>
              <h2>In the "Results" list, clicking the plus button on a track will add it to the right hand list.</h2>
              <h2>A track added to your custom playlist can be removed by clicking the minus button.</h2>
            </div>
            
            <div className="step-footer">
              <div className="footer-btn">
                <button type="button" className="previous-btn">Prev</button>
                <button type="button" className="next-btn">Next</button>
              </div>
            </div>
          </div>

          <div className="step step-5">
          <div className="step-header">5/6</div>
            <div className="form-group">
              <h1>Modifying Playlists</h1>
              <h2>Clicking the "Playlist Shuffle" button will replace each song in the tracklist with a random song having the same artist.</h2>
              <h3>Clicking the left arrow on the "Change Playlist" bar will navigate you to a previously rendered tracklist. </h3>
              <h3>Clicking the right arrow will undo this action.</h3>
            </div>
            
            <div className="step-footer">
              <div className="footer-btn">
                <button type="button" className="previous-btn">Prev</button>
                <button type="button" className="next-btn">Next</button>
              </div>
            </div>
          </div>

          <div className="step step-6">
            <div className="step-header">6/6</div>
            <div className="form-group">
              <h1>Saving Playlists</h1>
              <h2>Before downloading the playlist, be sure to give your playlist a name.</h2>
              <h2>Click the "Download to Spotify" button to download your playlist to your Spotify account.</h2>
            </div>
            
            <div className="step-footer">
              <div className="footer-btn">
                <button type="button" className="previous-btn">Prev</button>
                <button type="button" className="submit-btn">Close</button>
              </div>
            </div>
          </div>
        </div>
        
        <SearchBar onSearch={search} onLuckySearch={luckySearch} playlistSongs={playlistSongs}/>
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} onAdd={addSong}/>
          <Playlist playlistName={playlistName} playlistSongs={playlistSongs} onRemove={removeSong} onNameChange={updatePlaylistName} onNavLeft={playlistNavLeft} onNavRight={playlistNavRight} onShuffle={shufflePlaylist} onRandomize={randomizePlaylist} onSave={savePlaylist}/>
        </div>

        <div id="overlay"></div>
      </div>
    </div>
  );
}

export default App;
