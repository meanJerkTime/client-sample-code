'use strict';

//your React rendering will be based on the payload received from the game center


// This is the player that creates the room
const io = require('socket.io-client');
// const host = 'https://munchkin-game-center.herokuapp.com/games';
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
  console.log('<RoomList>',roomList);
})

games.on('NewRoomCreated', (gameRoomInfo)=>{
  // your react will start to render game room conponent
  console.log('<NewRoomCreated>',gameRoomInfo);
})


// When new user joins the room , server will send out this event, with the user info. keys are: username, userImg(url to profile img) and a message.
games.on('NewJoin', (payload)=>{
  // you can put some React logic to display a pop up window to noticify others there's a new user joined, and update the current view.
  console.log('<NewJoin>',payload);
  // two parts, one key in payload is message, a simple message telling you who joined the room.
  // the other part is the updated game room status, under key payload.roomStatus.currentUser
})


// when you're trying to join a room does NOT exsit, or already have 6 players,  you got an error. 
// Once receive this event, go back to game center lobby. 
games.on('JoinErr', (payload)=>{
  console.log('<JoinErr>',payload);
})


// Use this method to leave the room, try not just disconnect it.
// server will send out this event, with the message saying someone is left, and a updated room status. in payload.roomStatus.currentlayers
games.on('LeftRoom', (payload)=>{
  console.log('<LeftRoom>',payload);
})

// Use this event to properbly leave the game room, send it with !!!!! room owner's username !!!!!!!!.
// setTimeout(()=>{
//   games.emit('LeaveRoom', 'player1')
// },100000)


// Please stop here for now the fullowing logic is still under development



// setTimeout(()=>{
//   games.emit('StartGame', {roomOwner: 'player1', players: ['player1','player2', 'player3']});

// },15000);

games.on('InitialCards', (gameState)=>{

  localGameState=gameState

})

// setTimeout(()=>{
//   games.emit('UpdateHand', {
//     ...localGameState,
//     player1: {
//       level: 1,
//       cardsInHandQty:4,
//       cardsInHand:[
//         1,2,3,4
//       ],
//       cardsEquiptedQty:2,
//       cardsEquipted: [
//         3,4
//       ],
//     },
//   })
// },100000)