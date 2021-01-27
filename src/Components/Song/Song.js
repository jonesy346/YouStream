import React from 'react';
import './Song.css';

export default function Song(props) {
    const addSong = () => {
        props.onAdd(props.song);
    };

    const removeSong = () => {
        props.onRemove(props.song);
    };

    //Display "+" if track is not in the playlist
    //Display "-" if track is in the playlist
    
    const performAction = (boolean) => {
        if (boolean) {
            return (
                <button className="Song-action" onClick={removeSong}>-</button>
            )
        } else {
            return (
                <button className="Song-action" onClick={addSong}>+</button>
            );
        };
    };


    return (
        <div className="Song">
            <div className="Song-image">
                <img
                    src={props.song.imageUrl}
                    alt={props.song.album}
                />
            </div>
            <div className="Song-information">
                <h3>{props.song.name}</h3>
                <p>{props.song.artist} | {props.song.album}</p>
            </div>
            {performAction(props.isRemoval)} 
        </div>
    );
};
