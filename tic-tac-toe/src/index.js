import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {

//     constructor(props) {
//         super(props)
//     }
//     render() {
//       return (
//         <button className="square" onClick = {this.props.onClick()}>  
//         {this.props.value} 
//         </button>
//       );
//     }
    
//   }
  

  function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }


  class Board extends React.Component {
    
    // constructor(props) {
    //     super(props)
    // }

    renderSquare(i) {
      return <Square 
        value = {this.props.squares[i]}
        onClick = {() => {
            // trigger the handleClick action in parent Game
            this.props.onClick(i)
        }}
      />;
    }

    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            history: [
                {
                squares: Array(9).fill(null)
            }],
            nextX: true,
            stepNumber: 0
        }
    }

    handleClick = (i) => {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);

        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculate(squares) || squares[i]) return

        squares[i] = this.state.nextX ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares
          }]),
          stepNumber: history.length,
          nextX: !this.state.nextX,
        });
    }

    jumpTo = (i) => {
        this.setState({
            stepNumber: i,
            nextX: i % 2 === 0
        })
    }

    render() {

        //construct the previous move
        const hy = this.state.history
        const current = hy[this.state.stepNumber];

        // if one user has won, then just change status
        let res =  calculate(current.squares) 

        const moves = hy.map((square, index) => {
            const text =  index === 0 ? "Go to beginning" : "Go to move " + index
            return  (
                    <li>
                        <button onClick = { () => this.jumpTo(index)}>
                            {text}
                        </button>
                    </li>)
        })

        let status = 'Next player: ' + (this.state.nextX ? 'X' : 'Y');
        if (res) {
            status =  'Winner is ' + res;
        }

        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={i => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculate (cur_status) {
    for (let i = 0; i < cur_status.length; i = i + 3) {
        const a = cur_status[i];
        const b = cur_status[i + 1]
        const c = cur_status[i + 2]
        if (a && a === b && a === c) return a
    }
    return null
}