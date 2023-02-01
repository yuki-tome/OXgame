import { useState } from "react";
import "./styles.css";


function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
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




  /* function ToggleButton (on){
    function clickHandler() {
      this.setState({
        on: !on
      });
    }
    let className = this.state.on ? "switch on" : "switch";
    return (
        <div className={className} onClick={clickHandler}></div>
    );
  } */





  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  let cnt = 0;

  return (
    <>
      <div className="status">{status}
      {
        Array(3).fill(0).map((val, i) => {
          return (
            <div className="board-row">
              {
               Array(3).fill(0).map((val2, j) => {
                return(
                  <Square value={squares[ (3*i)+j ]} onSquareClick={() => handleClick( (3*i)+j )} />
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
      return squares[a];
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
  const [on, setOn] = useState(false);
  let col = new Array();
  let row = new Array();

  function handlePlay(nextSquares,i) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    /* console.log(currentMove+1) */
    setCurrentMove(nextHistory.length - 1);

    const newMass = [...mass, i+1];
    setMass(newMass);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    //着手履歴に移動した際にマスの記憶も合わせる
    const changeMass = [...mass.slice(0, nextMove-1)];
    console.log(mass[nextMove-1]);
    console.log(nextMove-1);
    setMass(changeMass);
    //移動した際にdescriptionの内容も修正
    const nextHistory = [...history.slice(0, nextMove)];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function onButtonClick(){
    console.log(description[2])
  }

  const moves = history.map((squares, move) => {
    let description = new Array(9);
    row[move-1] = mass[move-1] %3
    row[move-1] = (row[move-1] === 0) ? 3 : row[move-1]
  
    if (mass[move-1] <= 3) {
      col[move-1] = 1
    }
    else if (mass[move-1] <= 6) {
      col[move-1] = 2
    }else {
      col[move-1] = 3
    }

    if (move > 0) {
      description[move] = "Go to move #" + move + ' col:' + col[move-1] + ' row:' + row[move-1];
    } else {
      description[move] = "Go to game start";
    }
    console.log(description[move])
    return (
      <li key={move}>
        <button className="button" onClick={() => jumpTo(move)}>{description[move]}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className="order" onClick={() => onButtonClick()}>order</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
