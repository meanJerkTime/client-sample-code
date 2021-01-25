'use strict';

const io = require('socket.io-client');
// const host = 'https://munchkin-game-center.herokuapp.com/games';
const host = 'http://localhost:4322/games';


const user = {
  username:'player3', // whatever get back from server 
  profileImgUrl: "player3-img.url", // whatever stored in the server
}

const games = io.connect(host, {query:`user=${user.username}---${user.profileImgUrl}`});

var localGameState;


games.emit('Join', 'player1');
// everybody can create game, or join a game. but NOT both.
//games.emit('CreateGame', user.username);


games.on('RoomList', (payload)=>{
  console.log('<RoomList>',payload);
})

games.on('NewRoomCreated', (gameRoomInfo)=>{
  // your react will start to render game room conponent
  console.log('<NewRoomCreated>',gameRoomInfo);
})

games.on('NewJoin', (payload)=>{
  console.log('<NewJoin>',payload);
})


games.on('JoinErr', (payload)=>{
  console.log('<JoinErr>',payload);
})

games.on('LeftRoom', (payload)=>{
  console.log('<LeftRoom>',payload);
})


// Please stop here for now the fullowing logic is still under development


games.on('InitialCards', (gameState)=>{

  localGameState=gameState;

})

setTimeout(()=>{
  games.emit('UpdateHand', {
    ...localGameState,
    player3: {
      level: 1,
      cardsInHandQty:3,
      cardsInHand:[
        9,10,11
      ],
      cardsEquiptedQty:1,
      cardsEquipted: [
        12
      ],
    }
  })
},150000)