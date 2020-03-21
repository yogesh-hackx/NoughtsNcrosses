import React from "react";
import Square from "./Square";
import "./Styles/Board.css";

class Board extends React.Component {
  // Create the 3 x 3 board
  createBoard(row, col) {
    const board = [];
    let cellCounter = 0;

    for (let i = 0; i < row; i += 1) {
      const columns = [];
      for (let j = 0; j < col; j += 1) {
        columns.push(this.renderSquare(cellCounter++));
      }
      board.push(
        <tr key={i} className="board-row">
          {columns}
        </tr>
      );
    }

    return board;
  }

  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return <table>{this.createBoard(3, 3)}</table>;
  }
}

export default Board;
