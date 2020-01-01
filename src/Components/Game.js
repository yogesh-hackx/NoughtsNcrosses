import React, { useState, useEffect, useRef } from 'react'
import Cells from './Cells'
import Swal from 'sweetalert2'

const Game = (props) => {
	const [state, setState] = useState({
		squares: Array(9).fill(''),
		xScore: 0,
		oScore: 0,
		whosTurn: props.myTurn
	})

	var turn = useRef('X')
	var gameOver = useRef(false)
	var counter = useRef(0)

	useEffect(() => {
		props.pubnub.getMessage(props.gameChannel, (msg) => {
			if ( msg.message.turn === props.piece) {
				publishMove(msg.message.index, msg.message.piece)
			}

		else if(msg.message.reset){
        	setState({
		        squares: Array(9).fill(''),
		        xScore: 0,
				oScore: 0,
			    whosTurn : props.myTurn
        });

        turn.current = 'X';
        gameOver.current = false;
        counter.current = 0;
        Swal.close()
      }

      // End the game and go back to the lobby
      else if(msg.message.endGame){
        Swal.close();
        props.endGame();
      }
    });
	})

	const newRound = (winner) => {
		let title = (winner == null) ? 'Game Draw.!' : `Player ${winner} won..!`

		if((props.isRoomCreator === false) && gameOver.current) {
			Swal.fire({
				text: 'Waiting for New Round...',
			})

			turn.current = 'X'
		}
		else if(props.isRoomCreator && gameOver.current) {
			Swal.fire({
				title: title,
				text: 'Continue Playing?',
				showCancelButton: true,
				confirmButtonText: 'ohYeah.!',
				cancelButtonText: 'Nope'
			}).then((result) => {
				if(result.value) {
					props.pubnub.publish({
						message: {
							reset: true
						},
						channel: props.gameChannel
					})
				}
				else {
					props.pubnub.publish({
						message: {
							endGame: true
						},
						channel: props.gameChannel
					})
				}
			})
		}
	}

	const announceWinner = (winner) => {
		let pieces = {
			'X': state.xScore,
			'O': state.oScore
		}

		if(winner === 'X') {
			pieces['X'] += 1;
			setState({
				squares: state.squares,
				xScore: pieces['X'],
				oScore: state.oScore,
				whosTurn: state.whosTurn
			})
		}
		else {
			pieces['O'] += 1
			setState({
				squares: state.squares,
				xScore: state.xScore,
				oScore: pieces['O'],
				whosTurn: state.whosTurn
			})
		}

		gameOver.current = true
		newRound(winner)
	}


	const checkForWinner = (squares) => {
		const possibleCombinations = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		]

		for(let i = 0; i < possibleCombinations.length; i++) {
			const [a, b, c] = possibleCombinations[i]
			if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				announceWinner(squares[a])
				return;
			}
		}

		counter.current++;

		if(counter.current === 9) {
			gameOver.current = true
			newRound(null)
		}
	}

	const publishMove = (index, piece) => {
		const squares = state.squares

		squares[index] = piece
		turn.current = (squares[index] === 'X') ? 'O' : 'X'

		setState({
			squares: squares,
			xScore: state.xScore,
			oScore: state.oScore,
			whosTurn: !state.whosTurn
		})

		checkForWinner(squares)
	}

	const makeMove = (index) => {
		const squares = state.squares

		if ( !squares[index] && (turn.current === props.piece)) {
			
		squares[index] = props.piece

		setState({
			squares: squares,
			xScore: state.xScore,
			oScore: state.oScore,
			whosTurn: !state.whosTurn
		})

		turn.current = (turn.current === 'X') ? 'O' : 'X'

		props.pubnub.publish({
			message: {
				index: index,
				piece: props.piece,
				turn: turn.current
			},
			channel: props.gameChannel
		})

		checkForWinner(squares)
	}
}

	let status
	status = `${state.whosTurn ? "Your turn" : "Opponent's turn"}`



	return (
		<div className="game">
			<div className="cells">
				<Cells 
					squares={state.squares}
					onClick={index => makeMove(index)}
				/>

				<p className="status">{status}</p>
			</div>

			<div className="scores-container">
				<div>
					<p> Player X: {state.xScore}</p>
				</div>

				<div>
					<p> Player O: {state.oScore}</p>
				</div>
			</div>
		</div>
		)
}

export default Game