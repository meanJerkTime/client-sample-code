'use strict';

//your React rendering will be based on the payload received from the game center


// This is the player that creates the room
const io = require('socket.io-client');
// const host = 'https://munchkin-game-center.herokuapp.com/games';
const host = 'http://localhost:4322/games';

// when you login with auth server, you'll receive an token, with user key, contains username and profile img. you'll need to send that to the game center in the following query format.

const user = {
  username:'player1', // whatever get back from server 
  profileImgUrl: 'player1-img.url', // whatever stored in the server
};

const games = io.connect(host, {query:`user=${user.username}---${user.profileImgUrl}`});

var localGameState;
var currentPlayers;
var localWinner;

// everybody can create game, or join a game. but NOT both.
games.emit('CreateRoom', user.username);
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
});

games.on('NewRoomCreated', (gameRoomInfo)=>{
  // your react will start to render game room conponent
  console.log('<NewRoomCreated>',gameRoomInfo);

});


// When new user joins the room , server will send out this event, with the user info. keys are: username, userImg(url to profile img) and a message.
games.on('NewJoin', (payload)=>{
  // you can put some React logic to display a pop up window to noticify others there's a new user joined, and update the current view.
  console.log('<NewJoin>',payload);
  currentPlayers = payload.roomStatus.currentPlayers;
  // two parts, one key in payload is message, a simple message telling you who joined the room.
  // the other part is the updated game room status, under key payload.roomStatus.currentUser
});


// when you're trying to join a room does NOT exsit, or already have 6 players,  you got an error. 
// Once receive this event, go back to game center lobby. 
games.on('JoinErr', (payload)=>{
  console.log('<JoinErr>',payload);
});


// Use this method to leave the room, try not just disconnect it.
// server will send out this event, with the message saying someone is left, and a updated room status. in payload.roomStatus.currentlayers
games.on('LeftRoom', (payload)=>{
  console.log('<LeftRoom>',payload);
});

// Use this event to properbly leave the game room, send it with !!!!! room owner's username !!!!!!!!.
// setTimeout(()=>{
//   games.emit('LeaveRoom', 'player1')
// },100000)


// Please stop here for now the fullowing logic is still under development



setTimeout(()=>{
  games.emit('InitGame', {roomOwner: user.username, players: currentPlayers});
  localWinner = undefined;

},15000);


games.on('InitialCards', (gameState)=>{

  localGameState=gameState;
  console.log('initial state', localGameState);

});

setInterval(()=>{
  if (!localWinner && localGameState && localGameState.whosTurn === user.username){

    games.emit('UpdateGameStateAndTurn', {
      ...localGameState,
  
      [user.username]: {
        userName: user.username,
        level: Math.floor(Math.random() * 10),
        cardsInHand:[Math.floor(Math.random() * 10)],
        cardsEquipped: { 
          headGear: Math.floor(Math.random() * 10), 
          footGear: Math.floor(Math.random() * 10), 
          weapon: [Math.floor(Math.random() * 10)],
        },
      },
    });
  }
},3000);

games.on('UpdateLocalGameState', (gameState)=> {

  localGameState=gameState;
  console.log('updated state', localGameState);

});


setTimeout (()=>{

  games.emit('GameOver', {winner: user.username, roomOwner:user.username});

},40000);

games.on('Winner', (winner)=>{
  localWinner = winner;
  console.log('Winner is: ', localWinner);
});