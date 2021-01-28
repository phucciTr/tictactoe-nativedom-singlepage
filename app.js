// Data Tier
let table, nonTakenSquares, humanTurn, machineTurn, gameOver;

// Getters / setters
var getContainer = () => document.getElementById('container');
var getSquares = () => Array.from(document.getElementsByTagName('td'));
var getSquare = (id) => document.getElementById(`sqr${id}`);
var getWinText = () => document.getElementById('winText');
var disableSquare = (square) => square.style['pointer-events'] = 'none';
var enableSquare = (square) => square.style['pointer-events'] = 'auto';
var getId = (square) => square.id.split('sqr')[1];

var disableClick = (cb) => document.getElementById('matrix').style['pointer-events'] = 'none';
var enableClick = () => document.getElementById('matrix').style['pointer-events'] = 'auto';
var currentTurn = () => humanTurn ? 'human' : 'machine';
var refreshButton = () => document.getElementById('refresh');
var isTight = () => Object.keys(nonTakenSquares).length === 0;
var startGame = () => initializeTable();

// Data storage set up
var initializeDataStorage = () => {
  table = {};
  nonTakenSquares = {};
  humanTurn = true;
  machineTurn = false;
  gameOver = false;
};

// Resetter
var resetGame = () => {
  getSquares().forEach((square) => {
      square.innerText = '';
      enableSquare(square);
      square.removeAttribute('style');
  });
  initializeDataStorage();
  getWinText().remove();
  enableClick();
  initializeTable();
};

// Initialize data tier and add event listeners to view
var initializeTable = () => {
  initializeDataStorage();

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

// Connect event listener to controller
var clickHandler = (e) => handleClick(e);

// Start Of Program
startGame();


// Controller
var handleClick = (e) => {
  renderMove(e.target, 'X');
  updateModel(getId(e.target), 'X');
};

// View
var renderMove = (square, player) => {
  square.innerText = player;
  disableSquare(square);
}

// Model
var updateModel = (id, player) => {
  updateTable(id, player);

  hasWon(player, (winner) => {
    return !winner ? showWinner() : showWinner(winner);
  }, (otherwise) => switchTurn());
};

// Logic Tier
var updateTable = (id, player) => {
  table[id] = player;
  delete nonTakenSquares[id];
};

var hasWon = (player, winCB, next) => {
  if (hasDiagWin(player) || hasColWin(player) || hasRowWin(player)) {
    return winCB(player);
  }
  return isTight() ? winCB() : next();
};

var showWinner = (player) => {
  gameOver = true;
  let winMessage = player ? getWinMessage(player) : getWinMessage();
  getContainer().append(winMessage);
  disableClick();
};

var switchTurn = () => {
  if (currentTurn() === 'human') {
    humanTurn = false;
    machineTurn = true;
    generateMove();

  } else if (currentTurn() === 'machine') {
    humanTurn = true;
    machineTurn = false;
    enableClick();
  }
}

var hasDiagWin = (player) => checkWinDirection(player, 'diag');
var hasColWin = (player) => checkWinDirection(player, 'col');
var hasRowWin = (player) => checkWinDirection(player, 'row');

var checkWinDirection = (player, direction) => {
  return getPossibleWins(direction, (poss1, poss2, poss3) => {
    return hasWin(player, poss1, poss2, poss3);
  });
};

var generateMove = () => {
  let randomInt = Math.floor(Math.random() * (Object.keys(nonTakenSquares).length - 1) + 0);
  let squareId = Object.values(nonTakenSquares)[randomInt];
  let square = getSquare(squareId);

  disableClick();
  setTimeout(() => {
    renderMove(square, 'O');
    updateModel(square, squareId, 'O');
  }, 1000);
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
