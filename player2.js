'use strict';


const io = require('socket.io-client');
// const host = 'https://munchkin-game-center.herokuapp.com/games';
const host = 'http://localhost:4322/games';


const user = {
  username:'player2', // whatever get back from server 
  profileImgUrl: 'player2-img.url', // whatever stored in the server
};
const games = io.connect(host, {query:`user=${user.username}---${user.profileImgUrl}`});

var localGameState;
var localWinner;


games.emit('Join', 'player1');
// everybody can create game, or join a game. but NOT both.
//games.emit('CreateRoom', user.username);

games.on('RoomList', (payload)=>{
  console.log('<RoomList>',payload);
});

games.on('NewRoomCreated', (gameRoomInfo)=>{
  // your react will start to render game room conponent
  console.log('<NewRoomCreated>',gameRoomInfo);
});

games.on('NewJoin', (payload)=>{
  console.log('<NewJoin>',payload);
});


games.on('JoinErr', (payload)=>{
  console.log('<JoinErr>',payload);
});

games.on('LeftRoom', (payload)=>{
  console.log('<LeftRoom>',payload);
});

// Please stop here for now the fullowing logic is still under development

// Use this event to properbly leave the game room, send it with !!!!! room owner's username !!!!!!!!.
// setTimeout(()=>{
//   games.emit('LeaveRoom', 'player1');
// },12000);


games.on('InitialCards', (gameState)=>{


  localGameState=gameState;
  console.log('initial state',localGameState);

});

setInterval(()=>{
  if (!localWinner && localGameState &&localGameState.whosTurn === user.username){

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
},5000);


games.on('UpdateLocalGameState', (gameState)=> {
  
  localGameState=gameState;
  console.log('updated state', localGameState);

});

games.on('Winner', (winner)=>{
  localWinner = winner;
  console.log('Winner is: ', localWinner);
});
