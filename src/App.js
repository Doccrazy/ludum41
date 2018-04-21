import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import logo from './res/logo.txt'
import lambo from './res/lambo.png'
import Console from "./Console";
import Game from "./Game";
import Log from "./Log";

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
                <Game/>
                <br/>
                <Console/>
                <br/>
                <Log/>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default connect(state => ({
  shaking: state.game.shaking
}))(App);
