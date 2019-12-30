import React, { useState } from 'react';
import Cells from './Components/Cells'
import './App.css';

function App() {

  // const [state, setState] = useState({
  //   piece: '',
  // })

  return (
    <div className="App">
    <h1>Noughts & Crosses</h1>

    <Cells></Cells>
      
    </div>
  );
}

export default App;
