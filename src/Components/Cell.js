import React from 'react'

const Cell = props => {
	return(
		<td>
			<button className="cell">{props.value}</button>
		</td>
		)
	}
	

export default Cell