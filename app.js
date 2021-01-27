console.log('hello');

const table = {};
let humanTurn = true;
let machineTurn = false;

var getSquares = () => Array.from(document.getElementsByTagName('td'));
var disableSquare = (square) => square.style['pointer-events'] = 'none';
var getId = (square) => square.id.split('sqr')[1];
var getPlayer = (player) => player.innerText;


var disableTurn = () => document.getElementById('matrix').style['pointer-events'] = 'none';
var enableTurn = (cb) => document.getElementById('matrix').style['pointer-events'] = 'auto';
var toggleTurn = () => enableTurn(disableTurn());
var currentTurn = () => humanTurn ? 'human' : 'machine';


var switchTurn = () => {

  if (currentTurn() === 'human') {
    humanTurn = false;
    machineTurn = true;
    toggleTurn();
    // disableTurn();
    // enableTurn();

  } else if (currentTurn() === 'machine') {
    humanTurn = true;
    machineTurn = false;
  }
}


var checkWinner = (player) => {

  console.log('player = ', player);

  if (hasDiagWin(player) || hasColWin(player) || hasRowWin(player)) {
    console.log('WIN');

  } else { console.log('NOT YET'); }


};


var startMachine = () => {
  if (currentTurn() === 'machine') {
    disableTurn();
    makeMove();
  }
};



var hasDiagWin = (player) => checkWinDirection(player, 'diag');
var hasColWin = (player) => checkWinDirection(player, 'col');
var hasRowWin = (player) => checkWinDirection(player, 'row');


var checkWinDirection = (player, direction) => {
  return getPossibilit(direction, [], [], [], (poss1, poss2, poss3) => {
    return hasWin(player, poss1, poss2, poss3);
  });

};

var getPossibilit = (dir, placements1, placements2, placements3, cb) => {
  if (dir === 'diag') {
    placements1.push(table[0], table[4], table[8]);
    placements2.push(table[2], table[4], table[6]);

  } else if (dir === 'row') {
    placements1.push(table[0], table[1], table[2]);
    placements2.push(table[3], table[4], table[5]);
    placements3.push(table[6], table[7], table[8]);

  } else if (dir === 'col') {
    placements1.push(table[0], table[3], table[6]);
    placements2.push(table[1], table[4], table[7]);
    placements3.push(table[2], table[5], table[8]);
  }

  let possibility1 = new Set(placements1);
  let possibility2 = new Set(placements2);
  let possibility3 = (dir === 'diag') ? null : new Set(placements3);

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






var clickHandler = (e) => {
  console.log('turn = ', currentTurn());

  e.target.innerText = currentTurn() === 'human' ? 'X' : 'O';
  disableSquare(e.target);
  switchTurn();

  let clickedId = getId(e.target);
  let player = getPlayer(e.target);

  updateTable(clickedId, player);
  checkWinner(player);

  console.log('matrix = ', getSquares());
  console.log('table = ', table);
  console.log('');
}

var updateTable = (id, player, callback) => {
  table[id] = player;
};

var initializeTable = () => {
  getSquares().forEach((square) => {
    square.addEventListener(('click'), clickHandler);
    let id = getId(square);
    table[id] = null;
  });

};


var startGame = () => {
  initializeTable();
  startMachine();
};

startGame();


