import React, { useState, useEffect, useRef } from 'react';
import Cells from './Components/Cells'
import PubNubReact from 'pubnub-react'
import shortid from 'shortid'
import Swal from "sweetalert2"
import Credentials from './Credentials'
import Game from './Components/Game'
import './App.css';

function App() {

  var pubnub = new PubNubReact({
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

  console.log("Helllooooooo")

  var lobbyChannel = null
  var gameChannel = useRef("")
  var roomId = null

  useEffect (() => {
    if ( lobbyChannel != null ) {
      pubnub.getMessage(lobbyChannel, (msg) => {
        if ( msg.message.notRoomCreator ) {
          gameChannel.current = 'noughtsandcrosses-' + roomId
          pubnub.subscribe({
            channels: [gameChannel.current]
          })

          setState({
            piece: state.piece,
            isPlaying: true, // Updating this Variable
            isRoomCreater: state.isRoomCreater,
            isDisabled: state.isDisabled,
            myTurn: state.myTurn,
          })

          Swal.close()
        }
      })
    }

    return () => {
      pubnub.unsubscribe({
        channels: [lobbyChannel, gameChannel.current]
      })
    }
  })

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
    roomId = value
    lobbyChannel = 'noughtsandcrosses-' + roomId

    pubnub.hereNow({
      channels: [lobbyChannel],
    }).then((response) => {
        if ( response.totalOccupancy < 2) {
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
              notRoomCreator: true,
            },
            channel: lobbyChannel
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

  const endGame =() => {
    setState({
      piece: '',
      isPlaying: false,
      isRoomCreater: false,
      isDisabled: false,
      myTurn: false,
    })

    lobbyChannel = null
    gameChannel.current = null
    roomId = null

    pubnub.unsubscribe({
      channels: [lobbyChannel, gameChannel.current]
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
        gameChannel={gameChannel.current}
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
