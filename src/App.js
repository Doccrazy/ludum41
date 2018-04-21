import React, { Component } from 'react';
import './App.css';
import logo from './logo.txt'
import lambo from './lambo.png'
import cockpit from './cockpit.txt'

function processTemplate(template, context) {
  return template.replace(/\${(\w+)(?:\[(\d+)])?\s*(\w+)?}/g, function(match, varName, line, align) {
    const len = match.length;
    const str = ((context[varName] || '') + '').substr(0, len);
    const lineStr = str.split('\n')[line || 0] || '';
    if (align === "c") {
      const wsAdd = len - lineStr.length;
      return ' '.repeat(Math.trunc(wsAdd/2)) + lineStr + ' '.repeat(wsAdd - Math.trunc(wsAdd/2));
    } else if (align === "r") {
      return lineStr.padStart(len);
    }
    return lineStr.padEnd(len);
  })
}

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
              <pre>{processTemplate(cockpit, {
                rearMirror: 'Foobar',
                sideLeft: 'Line 1\nLine 2',
                sideRight: 'Line 1\nLine 2',
                leftTop: 'An ancient grandmother',
                rightTop: 'A sharp right turn',
                centerTop: 'A huge tree',
                rightMid: 'A puddle',
                leftBottom: 'Opponent 1',
                speed: 45,
                rpm: 4500
              })}</pre>
            </div>
          </div>
        </div>
    );
  }
}

export default App;
