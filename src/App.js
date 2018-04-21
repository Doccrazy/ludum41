import React, { Component } from 'react';
import './App.css';
import logo from './res/logo.txt'
import lambo from './res/lambo.png'
import Game from "./Game";

class App extends Component {
  render() {
    return (
        <div className="wrapper">
          <div className="header">
            <img src={lambo} alt="lambo" />
            <pre>{logo}</pre>
            <img src={lambo} alt="lambo" />
          </div>
          <div className="game">
            <div className="background">
              <Game/>
            </div>
          </div>
        </div>
    );
  }
}

export default App;
