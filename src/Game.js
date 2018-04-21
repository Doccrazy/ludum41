import React from 'react';
import { connect } from 'react-redux';
import {renderAll} from "./render";
import './Game.css';

class Game extends React.Component {
  render() {
    return <div className="gamePre" dangerouslySetInnerHTML={{__html: this.props.renderedGame}} />;
  }
}

export default connect(state => ({
  renderedGame: renderAll(state.game)
}))(Game);
