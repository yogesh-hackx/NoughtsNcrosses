import React from 'react'
import Cell from './Cell'

const Cells = props => {

	const createCells = (row, col) => {
		const cells = []
		let cellCounter = 0

		for(let i=0; i < row; i++) {
			const columns = []

			for(let j = 0; j < col; j++) {
				columns.push(createCell(cellCounter++))
			}

		cells.push(
			<tr key={i} className="cells-row">
				{columns}
			</tr>
			)
		}

		return cells

	}

	const createCell = i => {
		return (
			<Cell
				key={i}
				value={props.squares[i]}
				onClick={() => props.onClick(i)} 
			/>			
			)
		}
	

	return (
			<table>{createCells(3, 3)}</table>
		)
}

export default Cells