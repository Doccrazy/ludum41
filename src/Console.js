import React from 'react';
import { connect } from 'react-redux';
import {change, execute} from "./actions/console";
import './Console.css'

let mouseDown = 0;
document.body.onmousedown = function() {
  ++mouseDown;
};
document.body.onmouseup = function() {
  --mouseDown;
};

class Console extends React.Component {
  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.input && !mouseDown) {
        this.input.focus();
      }
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return <div className="console">
      &gt; <input ref={r => { this.input = r }}
                  value={this.props.input} onChange={ev => this.props.onChange(ev.target.value)}
                  onKeyPress={ev => { if (ev.charCode === 13) { this.props.onExec(); } }}/>
    </div>;
  }
}

export default connect(state => ({
  input: state.console.input
}), dispatch => ({
  onChange: value => dispatch(change(value)),
  onExec: () => dispatch(execute())
}))(Console);