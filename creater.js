'use strict';

//your React rendering will be based on the payload received from the game center


// This is the player that creates the room
const io = require('socket.io-client');
const host = 'http://localhost:4322/games';

// when you login with auth server, you'll receive an token, with user key, contains username and profile img. you'll need to send that to the game center in the following query format.

const user = {
  username:'player1', // whatever get back from server 
  profileImgUrl: "player1-img.url", // whatever stored in the server
}

const games = io.connect(host, {query:`user=${user.username}---${user.profileImgUrl}`});

var localGameState;

// everybody can create game, or join a game. but NOT both.
games.emit('CreateGame', user.username);
// games.emit('Join', 'targetRoomInfo);

//right after you connect to the game center, the server will send you a list of rooms open (not in game), it's an object, so use Object.keys to literater through it and display aviable rooms in your React logic.

// sample
// {
//   roomName(username): {
//     roomOwner: 'player1',
//     numOfPlayers: 2,
//     inGame: false,
//     currentPlayers: [ 
  //   {
  //     username: username,
  //     profileImgUrl: currentUserImg,
  //     socketID: socket.id,
  //   },
//     {another user info}
  // ]
//   },
//   anotherRoom: same format
// }
games.on('RoomList', (roomList)=>{
  // Your React logic goes here
  console.log(roomList);
})


// When new user joins the room , server will send out this event, with the user info. keys are: username, userImg(url to profile img) and a message.
games.on('NewJoin', (payload)=>{
  // you can put some React logic to display a pop up window to noticify others there's a new user joined, and update the current view.
  console.log(payload);
})


// when you're trying to join a room does NOT exsit, or already have 6 players,  you got an error. 
games.on('JoinErr', (errMessage)=>{
  console.log(errMessage);
})


// Use this method to leave the room, try not just disconnect it.
// server will send out this event, with the user info. keys are: username, userImg(url to profile img) and a message.
games.on('LeftRoom', (payload)=>{
  console.log(payload);
})

// Please stop here for now the fullowing logic is still under development

setTimeout(()=>{
  games.emit('StartGame', 'player1');

},10000);

games.on('InitialCards', (gameState)=>{
  console.log(gameState);

  localGameState=gameState;
})

setTimeout(()=>{
  games.emit('UpdateHand', {
    ...localGameState,
    player1: {
      level: 1,
      cardsInHandQty:4,
      cardsInHand:[
        1,2,3,4
      ],
      cardsEquiptedQty:2,
      cardsEquipted: [
        3,4
      ],
    },
  })
},100000)