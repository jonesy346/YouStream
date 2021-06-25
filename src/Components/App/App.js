import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';
import $ from 'jquery'; 

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

  useEffect(() => {
    // Update the document title using the browser API
      $(".modal").each(function() {
    
      var element = this;
      var pages = $(this).find('.modal-split');
    
      if (pages.length !== 0)
      {
          pages.hide();
          pages.eq(0).show();
    
          let b_button = document.createElement("button");
                    b_button.setAttribute("type","button");
                    b_button.setAttribute("class","btn btn-primary");
                    b_button.setAttribute("style","display: none;");
                    b_button.innerHTML = "Back";
    
          let n_button = document.createElement("button");
                    n_button.setAttribute("type","button");
                    n_button.setAttribute("class","btn btn-primary");
                    n_button.innerHTML = "Next";
    
          $(this).find('.modal-footer').append(b_button).append(n_button);
    
    
          var page_track = 0;
    
          $(n_button).on(function() {
            
            this.blur();
    
            if(page_track === 0)
            {
              $(b_button).show();
            }
    
            if(page_track === pages.length-2)
            {
              $(n_button).text("Submit");
            }
    
            if(page_track === pages.length-1)
            {
              $(element).find("form").submit();
            }
    
            if(page_track < pages.length-1)
            {
              page_track++;
    
              pages.hide();
              pages.eq(page_track).show();
            }
    
    
          });
    
          $(b_button).on(function() {
    
            if(page_track === 1)
            {
              $(b_button).hide();
            }
    
            if(page_track === pages.length-1)
            {
              $(n_button).text("Next");
            }
    
            if(page_track > 0)
            {
              page_track--;
    
              pages.hide();
              pages.eq(page_track).show();
            }
    
    
          });
    
      }
    
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
    // const overlay = app.querySelector('#overlay');

    modal.classList.add('active');
    // overlay.classList.add('active');
    
    // overlay.addEventListener('click', closeModal);
  }

  const closeModal = e => {
    const app = e.target.closest('.App');
    const modal = app.querySelector('.modal');
    // const overlay = app.querySelector('#overlay');

    modal.classList.remove('active');
    // overlay.classList.remove('active');
  }

  return (
    <div>
      <h1>YouStream</h1>
      <div className="App">
        <button className="Playlist-button" onClick={openModal}>Tutorial</button>

        {/* <div className="alert alert-info">
          Boostrap Multi-Page Modal - Each 
          <br/><code>&lt;div className=&quot;modal-split&quot;&gt;&lt;/div&gt;</code> 
          <br/>Declaration is a page. 
        </div>

        <div className="button">
          <button type="button" className="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
          Launch demo modal
          </button>
        </div>

        <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">

            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title" id="myModalLabel">Modal title</h4>
              </div>
        
              <div className="modal-body">
                <div className="modal-split">
                  1
                </div>

                <div className="modal-split">
                2
                </div>

                <div className="modal-split">
                3
                </div>	

              </div>

              <div className="modal-footer">
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-info">
          EX: (These divs go in the modal-body) 
          <br/><code>&lt;div className=&quot;modal-split&quot;&gt; Page 1 content goes here &lt;/div&gt;
          <br/>&lt;div className=&quot;modal-split&quot;&gt; Page 2 content goes here &lt;/div&gt;
          <br/>&lt;div className=&quot;modal-split&quot;&gt; and so on  &lt;/div&gt;</code>
        </div>  */}

        
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
      </div>
    </div>
  );
}

export default App;
