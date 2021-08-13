## YouStream

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Status](#status)
* [Acknowledgments](#acknowledgments)

## General info
This project is a simple API web application that allows users to search the Spotify library, create a custom playlist, and then save the playlist to their Spotify accounts. Tracklists that are made by the user are stored in sessionstorage so that they can be accessed later if desired.

*Requires having a Spotify account for searching the Spotify library and saving playlists.*

## Technologies
This project is created with:
* React version: 17.0.2
* Express version: 4.17.1
* SweetAlert version: 2.1.2
	
## Setup
To run this project, install it locally using npm:

```
$ cd ../public
$ npm install
$ npm start
```

This runs the app in development mode.
Open http://localhost:3000 to view it in the browser.

## Features
* Users can query the Spotify API by typing an input in the search bar.
* Search results are then displayed and users can add individual tracks to a tracklist.
* The tracklist can be shuffled (each song in the list will be replaced with another song by the artist).
* Users can navigate to their previously made tracklists.
* Tracklists can be given a name and downloaded to the user's Spotify account.

## Status
Finished.

## Acknowledgments
* Direct inspiration for project comes from the [Codecademy Pro](https://pro.codecademy.com/) intensive project *Jammming*. 
