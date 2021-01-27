import React from 'react';
import './Playlist.css';
import SongList from '../SongList/SongList.js';

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
            <input defaultValue={"New Playlist"} onChange={handleNameChange}/>
            <SongList 
                songs={props.playlistSongs}
                onRemove={props.onRemove} 
                isRemoval={true}
            /> 
            <button className="Playlist-button" onClick={shuffle}>Playlist Shuffler</button>
            <button className="Playlist-button" onClick={randomize}>Randomizer</button>
            <button className="Playlist-button" onClick={props.onSave}>Download to Spotify</button>
        </div>
    );
};
