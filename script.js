function players(character, number) {
  let _filledBoxes = [];
  let name = character;

  let _input = document.querySelector(`#player${number} input`);

  _input.addEventListener("change", (e) => (name = e.target.value));

  function play(index) {
    _filledBoxes.push(index);
    gameBoard.fillBox(index, character);
    if (_filledBoxes.length > 2 && _won(_filledBoxes))
      gameFlow.end(`${name} won the game!`);
    else if (_filledBoxes.length === 5) gameFlow.end("It' a tie!");
  }

  function _won(filledBoxes) {
    return _isSolution(filledBoxes, [
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
  function _isSolution(filledBoxes, solutions) {
    for (let i = 0; i < 8; i++) {
      let triplet = solutions[i];
      if (triplet.every((digit) => filledBoxes.includes(digit))) return true;
    }
    return false;
  }

  const reset = () => (_filledBoxes = []);

  return { play, reset };
}

let player1 = players("x", 1);
let player2 = players("o", 2);

const gameFlow = (() => {
  let _round = 1;

  function playRound(e) {
    let index = Number(e.target.getAttribute("data-key"));
    if (_round % 2 !== 0) player1.play(index);
    else player2.play(index);
    _round++;
  }

  function end(message) {
    _round = 0;
    player1.reset();
    player2.reset();
    gameBoard.end(message);
  }

  return { playRound, end };
})();

const gameBoard = (() => {
  let _board = new Array(9);

  let _boardHTML = document.querySelector(".board");
  let _boxes = document.querySelectorAll(".box");
  let _results = document.querySelector("#results");
  let _startBtn = document.querySelector("#start");
  let _resetBtn = document.querySelector("#reset");

  _startBtn.addEventListener("click", start);
  _resetBtn.addEventListener("click", reset);

  function fillBox(index, character) {
    if (!_board[index]) {
      _board[index] = character;
      _boxes[index].textContent = character;
    }
  }

  function start() {
    _boxes.forEach((box) => box.addEventListener("click", gameFlow.playRound));
    _boardHTML.classList.add("board-active");
    _startBtn.setAttribute("id", "start-hidden");
    _resetBtn.setAttribute("id", "reset-show");
  }

  function end(message) {
    _board = new Array(9);
    _boxes.forEach((box) =>
      box.removeEventListener("click", gameFlow.playRound)
    );
    _results.textContent = message;
  }

  function reset() {
    _board = new Array(9);
    _boxes.forEach((box) => (box.textContent = ""));
    //check if eventlisteners not removed
    _boxes.forEach((box) =>
      box.removeEventListener("click", gameFlow.playRound)
    );
    _boxes.forEach((box) => box.addEventListener("click", gameFlow.playRound));
    _results.textContent = "";
  }

  return { fillBox, end };
})();
