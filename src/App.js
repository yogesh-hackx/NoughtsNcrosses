import React, { useState } from 'react';
import Cells from './Components/Cells'
import PubNubReact from 'pubnub-react'
import shortid from 'shortid'
import Swal from "sweetalert2"
import Credentials from './Credentials'
import './App.css';

function App() {

  let pubnub = new PubNubReact({
    publishKey: Credentials.publishKey,
    subscribeKey: Credentials.subscribeKey
  })

  const [state, setState] = useState({
    piece: '',
    isPlaying: false,
    isRoomCreater: false,
    isDisabled: false,
    myTurn: false,
  })

  let lobbyChannel = null
  let gameChannel = null
  let roomId = null

  const componentDidUpdate = () => {
    if ( lobbyChannel != null ) {
      pubnub.getMessage(lobbyChannel, (msg) => {
        if ( msg.message.notRoomCreater ) {
          gameChannel = 'noughtsandcrosses-' + roomId
          pubnub.subscribe({
            channels: [gameChannel]
          })
        }
      })
    }
  }

  const onPressCreate = (event) => {
    roomId = shortid.generate().substring(0, 3)
    lobbyChannel = 'noughtsandcrosses-' + roomId

    pubnub.subscribe({
      channels: [lobbyChannel],
      withPresence: true
    })

    Swal.fire({
      allowOutsideClick: false,
      icon: 'success',
      title: roomId,
      text: 'Share this RoomID with your friend',
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
      showCancelButton: true
    }).then((result) => {
      if ( result.value ) {
        joinRoom(result.value)
      }
    })
  }

  const joinRoom = (value) => {
    roomId = value
    lobbyChannel = 'noughtsandcrosses-' + roomId

    pubnub.hereNow({
      channels: [lobbyChannel]
    }).then((response) => {
        if ( response.totalOccupancy <2) {
            pubnub.subscribe({
              channels: [lobbyChannel],
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
              notRoomCreater: true,
            },
            channel: lobbyChannel
          })
        }
        else {
          Swal.fire({
              title: 'Error',
              text: 'Room Currently Full.',
              icon: 'error',
          })
        }
    }).catch((error) => {
      console.log(error);
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
            cell={0}
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
      // Game Running Initiate

    }
    </div>
  );
}

export default App;
