## YouStream

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Status](#status)
* [Inspiration](#inspiration)

## General info
This project is a simple API web application store application that allows users to search the Spotify library, create a custom playlist, and then save the playlist to their Spotify accounts.

*Requires having a Spotify account for playlists to be saved.*

## Technologies
This project is created with:
* Stripe version: 8.137.0
* Express version: 4.17.1
	
## Setup
To run this project, install it locally using npm:

```
$ cd ../public
$ npm install
$ npm start
```

## Features
Product List
* When hovering over a product, users can select the "Add to Bag" button that appears to add the product to the shopping cart. Once the item is added, the "Add to Bag" button will be disabled
  * Cart items are stored in session storage to prevent users from adding the same item to a cart twice
* Products can be sorted by clicking the buttons in the store navigation section

Shopping Cart
* Quantity of a particular item in the shopping cart can be increased or decreased by selecting the up or down arrows, respectively. Total shopping cart price will automatically adjust
* Cart items can be removed by clicking 1) the "remove" button under each item or 2) the trash can icon that appears when there is only 1 quantity of a particular item
* Clicking the "Clear Cart" button will remove all items from the cart and adjust the total shopping cart price accordingly
* Clicking the "Checkout" button will take the user to a Stripe checkout interface, where credit card information can be entered 
  * When checking out, products and their prices are pulled from a products.json file to enhance security and prevent users from modifying the prices on the front-end 

## Status
Finished.

## Inspiration
* Inspiration for store theme comes from *Cornell Surgical Society* at Cornell University, a premed organization I was an active member of. 
* Direct inspiration for project comes from the [Codecademy Pro Intensive](https://pro.codecademy.com/) project *Jammming*. 
