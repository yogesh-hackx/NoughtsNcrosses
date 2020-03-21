import React, { Component } from "react";
import Game from "./Components/Game";
import Board from "./Components/Board";
import PubNubReact from "pubnub-react";
import Swal from "sweetalert2";
import shortid from "shortid";
import Credentials from './Credentials'
import WaveContainer from "./Components/WaveContainer";

class App extends Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: Credentials.publishKey,
      subscribeKey: Credentials.subscribeKey
    });

    this.inputRef = React.createRef()

    this.state = {
      piece: "",
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
      player1: 'Player 1',
      player2: 'Player 2'
    };

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;
    this.pubnub.init(this);
  }

  componentWillUnmount() {
    this.pubnub.unsubscribe({
      channels: [this.lobbyChannel, this.gameChannel]
    });
  }

  componentDidUpdate() {
    // Check that the player is connected to a channel
    if (this.lobbyChannel != null) {
      this.pubnub.getMessage(this.lobbyChannel, msg => {
        // Start the game once an opponent joins the channel
        if (msg.message.notRoomCreator) {
          // Create a different channel for the game
          this.gameChannel = "tictactoegame--" + this.roomId;

          this.pubnub.subscribe({
            channels: [this.gameChannel]
          });

          this.setState({
            isPlaying: true,
            player2: msg.message.player2,
          });

          this.pubnub.publish({
            message: {
              roomCreator: true,
              player1: this.inputRef.current.value
            },
            channel: this.lobbyChannel
          });

          // Close the modals if they are opened
          Swal.close();
        }

        if (msg.message.roomCreator){
          this.setState({
            player1: msg.message.player1
          })
        }
      });
    }
  }

  // Create a room channel
  onPressCreate = e => {
    if(!this.inputRef.current.value){
      console.log("Input A name");
      Swal.fire("Please input Your First Name")
      return;
    }
    // Create a random name for the channel
    this.roomId = shortid.generate().substring(0, 5);
    this.lobbyChannel = "tictactoelobby--" + this.roomId;

    this.pubnub.subscribe({
      channels: [this.lobbyChannel],
      withPresence: true
    });

    // Open the modal
    Swal.fire({
      position: "top",
      allowOutsideClick: false,
      title: "Share this room ID with your friend",
      text: this.roomId,
      width: 275,
      padding: "0.7em",
      // Custom CSS
      customClass: {
        heightAuto: false,
        title: "title-class",
        popup: "popup-class",
        confirmButton: "button-class"
      }
    });

    this.setState({
      piece: "X",
      player1: this.inputRef.current.value,
      isRoomCreator: true,
      isDisabled: true, // Disable the 'Create' button
      myTurn: true // Room creator makes the 1st move
    });
  };

  // The 'Join' button was pressed
  onPressJoin = e => {
    if (!this.inputRef.current.value) {
      console.log("Input A name");
      Swal.fire("Please input Your First Name");
      return;
    }
    Swal.fire({
      position: "top",
      input: "text",
      allowOutsideClick: false,
      inputPlaceholder: "Enter the room id",
      showCancelButton: true,
      confirmButtonColor: "rgb(208,33,41)",
      confirmButtonText: "OK",
      width: 275,
      padding: "0.7em",
      customClass: {
        heightAuto: false,
        popup: "popup-class",
        confirmButton: "join-button-class ",
        cancelButton: "join-button-class"
      }
    }).then(result => {
      // Check if the user typed a value in the input field
      if (result.value) {
        this.joinRoom(result.value);
      }
    });
  };

  // Join a room channel
  joinRoom = value => {
    this.roomId = value;
    this.lobbyChannel = "tictactoelobby--" + this.roomId;

    // Check the number of people in the channel
    this.pubnub
      .hereNow({
        channels: [this.lobbyChannel]
      })
      .then(response => {
        if (response.totalOccupancy < 2) {
          this.pubnub.subscribe({
            channels: [this.lobbyChannel],
            withPresence: true
          });

          this.setState({
            piece: "O",
            player2: this.inputRef.current.value
          });

          this.pubnub.publish({
            message: {
              notRoomCreator: true,
              player2: this.inputRef.current.value
            },
            channel: this.lobbyChannel
          });
        } else {
          // Game in progress
          Swal.fire({
            position: "top",
            allowOutsideClick: false,
            title: "Error",
            text: "Game in progress. Try another room.",
            width: 275,
            padding: "0.7em",
            customClass: {
              heightAuto: false,
              title: "title-class",
              popup: "popup-class",
              confirmButton: "button-class"
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Reset everything
  endGame = () => {
    this.setState({
      piece: "",
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false
    });

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;

    this.pubnub.unsubscribe({
      channels: [this.lobbyChannel, this.gameChannel]
    });
  };

  render() {
    return (
      <div>
        <div className="title">
          <h1>TIC TAC TOE</h1>
        </div>
        <WaveContainer />

        {!this.state.isPlaying && (
          <div className="game">
            <div className="board">
              {/* <Board squares={0} onClick={index => null} /> */}

              <div className="button-container">
                <div className="page">
                  <label className="field a-field a-field_a1">
                    <input className="field__input a-field__input" placeholder="e.g. Stanislav" required />
                    <span className="a-field__label-wrap">
                      <span className="a-field__label">First name</span>
                    </span>
                  </label>
                </div>
                {/* <input type="text" ref={this.inputRef} /> */}
                <button
                  className="create-button "
                  disabled={this.state.isDisabled}
                  onClick={e => this.onPressCreate()}
                >
                  {" "}
                  Create
                </button>
                <button
                  className="join-button"
                  onClick={e => this.onPressJoin()}
                >
                  {" "}
                  Join
                </button>
              </div>
            </div>
          </div>
        )}

        {this.state.isPlaying && (
          <Game
            pubnub={this.pubnub}
            gameChannel={this.gameChannel}
            piece={this.state.piece}
            isRoomCreator={this.state.isRoomCreator}
            myTurn={this.state.myTurn}
            xUsername={this.state.player1}
            oUsername={this.state.player2}
            endGame={this.endGame}
          />
        )}
      </div>
    );
  }
}

export default App;
