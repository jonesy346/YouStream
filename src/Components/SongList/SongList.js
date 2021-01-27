import React from 'react';
import "./SongList.css";
import Song from "../Song/Song.js";

export default function SongList(props) {

    return (
        <div className="SongList">
            {props.songs.map(song => <Song song={song} key={song.id} onAdd={props.onAdd} onRemove={props.onRemove} isRemoval={props.isRemoval}/>)}
        </div>
    );
};
