import React, { useState } from 'react';
import './SearchBar.css';

export default function SearchBar(props) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const search = () => {
        props.onSearch(searchTerm);
    };

    const luckySearch = () => {
        props.onLuckySearch(searchTerm);
    }

    return (
        <div>
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={handleTermChange}/>
                <span className="span">
                    <button className="SearchButton" onClick={search}>Search</button>
                    <button className="SearchButton" onClick={luckySearch}>I'm Feeling Lucky</button>
                </span> 
            </div>
        </div>
    )
}
