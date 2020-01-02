import React, { useState } from 'react';
import Cells from './Components/Cells'
import Main from './Main'
import shortid from 'shortid'
import Swal from "sweetalert2"

import Game from './Components/Game'
import './App.css';


function App(props) {

  const [state, setState] = useState({
    piece: '',
    isPlaying: false,
    isRoomCreater: false,
    isDisabled: false,
    myTurn: false,
  })

  const pubnub = props.pubnub

  var gameChannel = props.gameChannel

  const onPressCreate = (event) => {
    props.Main.roomId = shortid.generate().substring(0, 3)
    props.lobbyChannel = 'noughtsandcrosses-' + props.this.roomId
    console.log("Inside onPressCreate: "+ props.props.lobbyChannel)

    pubnub.subscribe({
      channels: [props.lobbyChannel],
      withPresence: true
    })

    Swal.fire({
      allowOutsideClick: false,
      icon: 'success',
      title: this.roomId,
      text: 'Share this Room ID with your friend',
      width: 275,
    })

    setState({
      piece: 'X',
      isPlaying: state.isPlaying,
      isRoomCreater: true,
      isDisabled: true,
      myTurn: true,
    })
  }

  const onPressJoin = (event) => {
    Swal.fire({
      input: 'text',
      allowOutsideClick: false,
      inputPlaceholder: 'Enter Room ID',
      showCancelButton: true,
      confirmButtonText: 'OK',
      customClass: {
        heightAuto: false,
        popup: 'popup-class',
        confirmButton: 'join-button-class ',
        cancelButton: 'join-button-class'
    } 
    }).then((result) => {
      if ( result.value ) {
        joinRoom(result.value)
      }
    })
  }

  const joinRoom = (value) => {
    this.roomId = value
    props.lobbyChannel = 'noughtsandcrosses-' + this.roomId

    pubnub.hereNow({
      channels: [props.lobbyChannel],
    }).then((response) => {
        if ( response.totalOccupancy < 2) {
            pubnub.subscribe({
              channels: [props.lobbyChannel],
              withPresence: true
            })

          setState({
            piece: 'O',
            isPlaying: state.isPlaying,
            isRoomCreater: state.isRoomCreater,
            isDisabled: state.isDisabled,
            myTurn: state.myTurn,
          })

          pubnub.publish({
            message: {
              notRoomCreator: true,
            },
            channel: props.lobbyChannel
          })
        }
        else {
          Swal.fire({
              title: 'Error',
              text: 'Room Currently Full.',
              icon: 'error',
              customClass: {
                heightAuto: false,
                title: 'title-class',
                popup: 'popup-class',
                confirmButton: 'button-class'
            }
          })
        }
    }).catch((error) => {
      console.log(error);
    })
  }

  const endGame = () => {
    setState({
      piece: '',
      isPlaying: false,
      isRoomCreater: false,
      isDisabled: false,
      myTurn: false,
    })

    props.lobbyChannel = null
    gameChannel = null
    this.roomId = null

    pubnub.unsubscribe({
      channels: [props.lobbyChannel, gameChannel]
    })
  }

  return (
    <div className="App">
    <h1 className="title">Noughts & Crosses</h1>

    {
      !state.isPlaying &&
      <div className="game">
        <div className="cells">
          <Cells 
            squares={0}
            onClick={index => null}
          />
        </div>

        <div className="button-container">
          <button
            className="create-button btn-primary"
            disabled={state.isDisabled}
            onClick={(event) => onPressCreate()}
            >
            Create
          </button>
          <button className="join-button btn-success"
            onClick={(event) => onPressJoin()}
            >
            Join
          </button>
        </div>
      </div>
    }

    {
      state.isPlaying && 
      <Game
        pubnub={pubnub}
        gameChannel={gameChannel}
        piece={state.piece}
        isRoomCreater={state.isRoomCreater}
        myTurn={state.myTurn}
        xUsername={state.xUsername}
        oUsername={state.oUsername}
        endGame={endGame} 
      />
    }
    </div>
  );
}

export default App;
