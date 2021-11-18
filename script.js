function players(character) {
  let _filledBoxes = [];
  function play(index) {
    _filledBoxes.push(index);
    gameBoard.fillBox(index, character);
    if (won(_filledBoxes))
      gameFlow.endGame(character, `${character} won the game!`);
    else if (_filledBoxes.length === 5) gameFlow.endGame("It' a tie!");
  }
  function won(filledBoxes) {
    if (filledBoxes.length < 3) return false;
    return matchSolution(filledBoxes, [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]);
  }
  function matchSolution(filledBoxes, solutions) {
    for (let i = 0; i < 8; i++) {
      let triplet = solutions[i];
      if (triplet.every((digit) => filledBoxes.includes(digit))) return true;
    }
    return false;
  }
  function emptyGame() {
    _filledBoxes = [];
  }
  return { play, emptyGame };
}
const player1 = players("x");
const player2 = players("o");

const gameFlow = (() => {
  let _round = 1;
  function playRound(e) {
    let index = Number(e.target.getAttribute("data-key"));
    if (_round % 2 !== 0) player1.play(index);
    else player2.play(index);
    _round++;
  }
  function endGame(player, message) {
    _round = 0;
    console.log(message);
    player1.emptyGame();
    player2.emptyGame();
    gameBoard.emptyBoard(player);
  }
  return { playRound, endGame };
})();

const gameBoard = (() => {
  let _board = new Array(9);
  //cache DOM
  let _boxes = document.querySelectorAll(".box");
  let _results = document.querySelector("#results");
  //event listeners
  _boxes.forEach((box) => box.addEventListener("click", gameFlow.playRound));
  //actions
  function fillBox(index, character) {
    if (!_board[index]) _board[index] = character;
    _render(index);
  }
  function emptyBoard(player) {
    _board = new Array(9);
    _boxes.forEach((box) => (box.textContent = ""));
    _results.textContent = `${player} won the game!`;
  }
  //render
  function _render(index) {
    _boxes[index].textContent = _board[index];
  }
  return { fillBox, emptyBoard };
})();
