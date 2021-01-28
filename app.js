let table, nonTakenSquares, humanTurn, machineTurn, gameOver;

// Getters / setters
var getContainer = () => document.getElementById('container');
var getSquares = () => Array.from(document.getElementsByTagName('td'));
var getWinText = () => document.getElementById('winText');
var disableSquare = (square) => square.style['pointer-events'] = 'none';
var enableSquare = (square) => square.style['pointer-events'] = 'auto';
var getId = (square) => square.id.split('sqr')[1];
var getPlayer = (player) => player.innerText;

var setUpTable = () => {
  table = {};
  nonTakenSquares = {};
  humanTurn = true;
  machineTurn = false;
  gameOver = false;
};

var disableClick = (cb) => document.getElementById('matrix').style['pointer-events'] = 'none';
var enableClick = () => document.getElementById('matrix').style['pointer-events'] = 'auto';
var currentTurn = () => humanTurn ? 'human' : 'machine';
var refreshButton = () => document.getElementById('refresh');
var isTight = () => Object.keys(nonTakenSquares).length === 0;
var startGame = () => initializeTable();

var resetGame = () => {
  getSquares().forEach((square) => {
      square.innerText = '';
      enableSquare(square);
      square.removeAttribute('style');
  });

  setUpTable();
  getWinText().remove();
  enableClick();
  initializeTable();
};

// Set up table and event listeners
var initializeTable = () => {
  setUpTable();

  getSquares().forEach((square) => {
    square.addEventListener(('click'), clickHandler);
    let id = getId(square);
    table[id] = null;
    nonTakenSquares[id] = id;
  });
  refreshButton().addEventListener(('click'), (e) => {
    if (gameOver) { resetGame(); }
  });

};

// Controller
var clickHandler = (e) => handleClick(e);


// Model
var handleClick = (e) => {
  placeMove(e.target);

  let clickedId = getId(e.target);
  let player = getPlayer(e.target);

  disableSquare(e.target);
  updateTable(clickedId, player);
  checkWinner(player);
};

// View
var placeMove = (square) => square.innerText = 'X';


// Start
startGame();


// Helpers
var updateTable = (id, player) => {
  table[id] = player;
  delete nonTakenSquares[id];
};

var checkWinner = (player) => {
  if (hasDiagWin(player) || hasColWin(player) || hasRowWin(player)) {
    gameOver = true;
    showWinner(player);
    disableClick();

  } else if (isTight()) {
    gameOver = true;
    showWinner();
    disableClick();

  } else { switchTurn(); }
};

var hasDiagWin = (player) => checkWinDirection(player, 'diag');
var hasColWin = (player) => checkWinDirection(player, 'col');
var hasRowWin = (player) => checkWinDirection(player, 'row');


var checkWinDirection = (player, direction) => {
  return getPossibleWins(direction, (poss1, poss2, poss3) => {
    return hasWin(player, poss1, poss2, poss3);
  });
};

var switchTurn = () => {
  if (currentTurn() === 'human') {
    humanTurn = false;
    machineTurn = true;
    disableClick();
    generateMove();

  } else if (currentTurn() === 'machine') {
    humanTurn = true;
    machineTurn = false;
    enableClick();
  }
}

var generateMove = (cb) => {
  let randomInt = Math.floor(Math.random() * (Object.keys(nonTakenSquares).length - 1) + 0);
  let squareId = Object.values(nonTakenSquares)[randomInt];
  let square = document.getElementById(`sqr${squareId}`);

  setTimeout(() => {
    square.innerText = 'O';
    disableSquare(square);
    updateTable(squareId, 'O');
    checkWinner('O');
  }, 1000);
};


var showWinner = (player) => {
  let winMessage = player ? getWinMessage(player) : getWinMessage();
  getContainer().append(winMessage);
};

var getWinMessage = (player) => {
  let winMessage = document.createElement('h2');
  winMessage.setAttribute('id', 'winText');

  if (player) {
    winMessage.innerText = player === 'O' ? 'Machine Wins' : 'Human Wins';
  } else { winMessage.innerText = 'Tight'; }

  return winMessage;
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










