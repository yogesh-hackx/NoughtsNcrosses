import React from 'react'

const Cell = props => {
	return(
		<td>
			<button 
				className={`cell`}
				onClick={props.onClick}
			>{props.value}</button>
		</td>
		)
	}
	

export default Cell