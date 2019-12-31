import React, { useState } from 'react';
import Cells from './Components/Cells'
import './App.css';

function App() {

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

  const onPressCreate = (event) => {

  }

  const onPressJoin = (event) => {
    
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
