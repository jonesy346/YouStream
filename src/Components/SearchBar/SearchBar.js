import React, { useState } from 'react';
import './SearchBar.css';
// import { GoogleLogin } from 'react-google-login';

export default function SearchBar(props) {
    // const clientID = '1071802953665-a2slc9o1ql6oqq7k4jnffvd1jorguqif.apps.googleusercontent.com';

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


    // const getBookShelves = (token) => {
    //     fetch('www.googleapis.com/books/v1/mylibrary/bookshelves', {
    //         method: 'GET',
    //         headers: {
    //             Authorization: `${token}`
    //           }
    //     }).then((res) => res.text()).then((data) => console.log('This is your data', data))
    // };

    // async function responseGoogle(response) {
    //     setAccessToken(await response.accessToken);
    //     console.log(response);
    //     console.log(accessToken);
    //     getBookShelves(accessToken);
    // };

    // // https://www.googleapis.com/auth/books	

    return (
        <div>
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={handleTermChange}/>
                {/* <GoogleLogin clientId={clientID} buttonText="Login" onSuccess={responseGoogle} onFailure={responseGoogle} scope='https://www.googleapis.com/auth/books'/> */}
                <span className="span">
                    <button className="SearchButton" onClick={search}>Search</button>
                    <button className="SearchButton" onClick={luckySearch}>I'm Feeling Lucky</button>
                </span> 
            </div>
        </div>
    )
}
