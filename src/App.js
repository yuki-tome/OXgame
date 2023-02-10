import { useState } from "react";
import "./styles.css";


function Square({ winner, number, value, onSquareClick }) {
  let winmass=0;
  if( number===winner[0] || number===winner[1] || number===winner[2]){
    winmass = 1;
  }
  return (
    <button className={winmass ? "winsquare" : "square"} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, history}) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares,i);
  }

  const winner = calculateWinner(squares);
  let winnumber = new Array();
  let status;
  if (winner) {
    status = "Winner: " + winner[0];
    winnumber = winner[1];
  } else if (history.length > 9) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div>
        <div className="status">{status}</div>
        {
          [0, 1, 2].map((i) => {
            return (
              <div className="board-row">
                {
                [0, 1, 2].map((j) => {
                  return(
                    <Square winner={winnumber} number={(3*i)+j} value={squares[ (3*i)+j ]} onSquareClick={() => handleClick( (3*i)+j )} />
                    );
                  })
                }
              </div>
            );
          })
        }
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [mass, setMass] = useState([]);
  const [reverse, setReverse] = useState(false);
  let col = new Array();
  let row = new Array();
  let description = new Array(9);

  function handlePlay(nextSquares,i) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const newMass = [...mass, i];
    setMass(newMass);
  }

  function jumpTo(move) {
    //着手履歴に移動した際にマスの記憶も合わせる
    const changeMass = [...mass.slice(0, move)];
    setMass(changeMass);
    //移動した際にdescriptionの内容も修正
    const nextHistory = [...history.slice(0, move+1)];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function onPlaceMass(move){
    row[move-1] = mass[move-1] %3+1
  
    if (mass[move-1] < 3) {
      col[move-1] = 1
    }
    else if (mass[move-1] < 6) {
      col[move-1] = 2
    }else {
      col[move-1] = 3
    }
  }

  function onButtonClick(){
    setReverse(!reverse);
  }


  const moves = history.map((squares, move) => {
    /* let description = new Array(9); */
    onPlaceMass(move);
    if (move > 0) {
      description[move] = "Go to move #" + move + ' col:' + col[move-1] + ' row:' + row[move-1];
    } else {
      description[move] = "Go to game start";
    }
  });
  
  const descriptions = history.map((squares, move) => {
    if (move === 0){
      return(
        <ul key={0}>
          <button className="button" onClick={() => jumpTo(0)}>{description[0]}</button>
        </ul>
      );
    }
    else {
      move = reverse ? history.length-move : move;
      return (
        <li key={move}>
          <button className="button" onClick={() => jumpTo(move)}>{description[move]}</button>
        </li>
      );
    }
  });
  

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} history={history}/>
      </div>
      <div className="game-info">
        <button className="order" onClick={() => onButtonClick()}>order</button>
        <ol>{descriptions}</ol>
      </div>
    </div>
  );
}
