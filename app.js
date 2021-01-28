console.log('hello');

const table = {};
let nonTakenSquares = {};
let humanTurn = true;
let machineTurn = false;

var getSquares = () => Array.from(document.getElementsByTagName('td'));
var disableSquare = (square) => square.style['pointer-events'] = 'none';
var getId = (square) => square.id.split('sqr')[1];
var getPlayer = (player) => player.innerText;


var disableHumanTurn = () => document.getElementById('matrix').style['pointer-events'] = 'none';
var enableHumanTurn = (cb) => document.getElementById('matrix').style['pointer-events'] = 'auto';
var currentTurn = () => humanTurn ? 'human' : 'machine';


var switchTurn = (clickedId) => {

  if (currentTurn() === 'human') {
    humanTurn = false;
    machineTurn = true;
    disableHumanTurn();
    makeMachineMove(clickedId);

  } else if (currentTurn() === 'machine') {
    humanTurn = true;
    machineTurn = false;
    enableHumanTurn();
  }
}

var makeMachineMove = (clickedId) => {
  let randomInt = Math.floor(Math.random() * (Object.keys(nonTakenSquares).length - 1) + 0);
  let squareId = Object.values(nonTakenSquares)[randomInt];
  let square = document.getElementById(`sqr${squareId}`);
  square.innerText = 'O';

  disableSquare(square);
  updateTable(squareId, 'O');
  checkWinner('O');
  switchTurn();
};


var checkWinner = (player) => {

  if (hasDiagWin(player) || hasColWin(player) || hasRowWin(player)) {
    console.log('WIN');

  } else { console.log('NOT YET'); }

};


var startMachine = () => {
  if (currentTurn() === 'machine') {
    disableHumanTurn();
    makeMove();
  }
};



var hasDiagWin = (player) => checkWinDirection(player, 'diag');
var hasColWin = (player) => checkWinDirection(player, 'col');
var hasRowWin = (player) => checkWinDirection(player, 'row');


var checkWinDirection = (player, direction) => {
  return getPossibleWins(direction, (poss1, poss2, poss3) => {
    return hasWin(player, poss1, poss2, poss3);
  });
};

var getPossibleWins = (dir, cb) => {
  let possibility1, possibility2, possibility3;

  if (dir === 'diag') {
    possibility1 = new Set([table[0], table[4], table[8]]);
    possibility2 = new Set([table[2], table[4], table[6]]);

  } else if (dir === 'row') {
    possibility1 = new Set([table[0], table[1], table[2]]);
    possibility2 = new Set([table[3], table[4], table[5]]);
    possibility3 = new Set([table[6], table[7], table[8]]);

  } else if (dir === 'col') {
    possibility1 = new Set([table[0], table[3], table[6]]);
    possibility2 = new Set([table[1], table[4], table[7]]);
    possibility3 = new Set([table[2], table[5], table[8]]);
  }

  possibility3 = (dir === 'diag') ? null : possibility3;
  return cb(possibility1, possibility2, possibility3);
};


var hasWin = (player, poss1, poss2, poss3) => {
  if (!poss3) {
    return poss1.size === 1 && poss1.has(player) ||
           poss2.size === 1 && poss2.has(player)
  }
  return poss1.size === 1 && poss1.has(player) ||
         poss2.size === 1 && poss2.has(player) ||
         poss3.size === 1 && poss3.has(player);
};


var placeMovement = (square) => {
  square.innerText = 'X';
};


var clickHandler = (e) => {

  placeMovement(e.target);
  disableSquare(e.target);

  let clickedId = getId(e.target);
  let player = getPlayer(e.target);

  updateTable(clickedId, player);
  checkWinner(player);
  switchTurn(clickedId);
}

var updateTable = (id, player, callback) => {
  table[id] = player;
  delete nonTakenSquares[id];
};

var initializeTable = () => {
  getSquares().forEach((square) => {
    square.addEventListener(('click'), clickHandler);
    let id = getId(square);
    table[id] = null;
    nonTakenSquares[id] = id;
  });

};


var startGame = () => {
  initializeTable();
};

startGame();


