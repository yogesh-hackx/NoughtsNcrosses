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
			<div key={i} className="cells-row">
				{columns}
			</div>
			)
		}

		return cells

	}

	const createCell = i => {
		return (
			<Cell key={i} />			
			)
		}
	

	return (
			<div>{createCells(3, 3)}</div>
		)
}

export default Cells