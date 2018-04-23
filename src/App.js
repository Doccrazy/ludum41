import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import logo from './res/logo.txt'
import lambo from './res/lambo.png'
import Console from "./Console";
import Game from "./Game";
import Log from "./Log";
import Tutorial from "./Tutorial";
import Rain from "./Rain";
import {getPlayer} from "./actions/game";

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
              <div className={`gamePre  ${this.props.shaking ? 'shake' : ''}`}>
                <Rain/>
                <Game/>
                <br/>
                <Console/>
                <br/>
                <Log/>
              </div>
            </div>
          </div>
          <Tutorial/>
        </div>
    );
  }
}

export default connect(state => ({
  shaking: state.game.shaking || (getPlayer(state).isOffTrack() && getPlayer(state).speed > 0)
}))(App);
