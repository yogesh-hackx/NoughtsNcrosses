import React, { Component } from 'react'
import PubNubReact from 'pubnub-react'
import Credentials from './Credentials'
import App from './App'
import Swal from "sweetalert2"

class Main extends Component {

	constructor(props) {
		super(props)
		this.pubnub = new PubNubReact({
			publishKey: Credentials.publishKey,
			subscribeKey: Credentials.subscribeKey
		})

		this.pubnub.init(this)
	}

	const gameVars = (value) => {
		return (
			lobbyChannel = value

		)

	}

	gameChannel = null
	roomId = null
	
	componentDidUpdate() {
		console.log("Helo")
	    if ( this.lobbyChannel != null ) {
	      this.pubnub.getMessage(this.lobbyChannel, (msg) => {
	        if ( msg.message.notRoomCreator ) {
	          this.gameChannel = 'noughtsandcrosses-' + this.roomId
	          this.pubnub.subscribe({
	            channels: [this.gameChannel]
	          })

	          	// Add function to update state from App.js

	          Swal.close()
	        }
	      })
	    }
	}

	componentWillUnmount() {
		this.pubnub.unsubscribe({
	        channels: [this.lobbyChannel, this.gameChannel]
	      })
	}



	render() {
		return(
				<App
					pubnub={this.pubnub}
					lobbyChannel={(value) => gameVars()}
					roomId={this.roomId}

				/>
			)
	}

	


}

export default Main