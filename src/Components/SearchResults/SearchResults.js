import React from 'react';
import "./SearchResults.css";
import SongList from '../SongList/SongList.js';

export default function SearchResults(props) {
    return (
        <div className="SearchResults">
            <h2>Results</h2>
            <SongList songs={props.searchResults} onAdd={props.onAdd}/>
        </div>
    )
}
