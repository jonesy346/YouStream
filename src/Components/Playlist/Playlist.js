import React from 'react';
import './Playlist.css';
import SongList from '../SongList/SongList.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleLeft, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons'

export default function Playlist(props) {
    const handleNameChange = (event) => {
        props.onNameChange(event.target.value);
    };

    const shuffle = () => {
        props.onShuffle(props.playlistSongs);
    }

    const randomize = () => {
        props.onRandomize(props.playlistSongs);
    }

    return (
        <div className="Playlist">
            <input placeholder={"Enter new playlist name"} onChange={handleNameChange}/>

            <div className="Playlist-nav">
                <FontAwesomeIcon icon={faArrowAltCircleLeft} className="fa-icons" onClick={props.onNavLeft}/>
                <h3>Change Playlist</h3>
                <FontAwesomeIcon icon={faArrowAltCircleRight} className="fa-icons" onClick={props.onNavRight}/>
            </div>
            <SongList 
                songs={props.playlistSongs}
                onRemove={props.onRemove} 
                isRemoval={true}
            /> 
            <button className="Playlist-button" onClick={shuffle}>Playlist Shuffler</button>
            {/* <button className="Playlist-button" onClick={randomize}>Randomizer</button> */}
            <button className="Playlist-button" onClick={props.onSave}>Save to Spotify</button>
        </div>
    );
};
