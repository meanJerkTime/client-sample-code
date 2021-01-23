'use strict';

//your React rendering will be based on the payload received from the game center


// this is a player
const io = require('socket.io-client');
const host = 'http://localhost:4322/games';// whatever the hub is.

// when you login with auth server, you'll receive an token, with user key, contains username and profile img. you'll need to send that to the game center in the following query format.
const user = {
  username:'player2', // whatever get back from server 
  profileImgUrl: "player2-img.url", // whatever stored in the server
}
const games = io.connect(host, {query:`user=${user.username}---${user.profileImgUrl}`});

var localGameState;

// the following Join event will need to send the room name (in our case, the room creater's username)
games.emit('Join', 'player1');
// everybody can create game, or join a game. but NOT both.
//games.emit('CreateGame', user.username);

games.on('RoomList', (payload)=>{
  console.log(payload);
})

games.on('NewJoin', (payload)=>{
  console.log(payload);
})


games.on('JoinErr', (payload)=>{
  console.log(payload);
})

games.on('LeftRoom', (payload)=>{
  console.log(payload);
})

// Please stop here for now the fullowing logic is still under development


games.on('InitialCards', (gameState)=>{
  console.log(gameState);

  localGameState=gameState;
})

setTimeout(()=>{
  games.emit('UpdateHand', {
    player2: {
      level: 1,
      cardsInHandQty:1,
      cardsInHand:[
        5
      ],
      cardsEquiptedQty:3,
      cardsEquipted: [
        6,7,8
      ],
    },
  })
},120000)