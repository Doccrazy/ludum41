import React from 'react';
import { connect } from 'react-redux';

const COUNT = 250;
const WIDTH = 1080;
const HEIGHT = 500;
const MOVE = { x: -2, y: 4 };

class Rain extends React.Component {
  state = {
    particles: initParticles()
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      const newParticles = this.state.particles.slice();
      update(newParticles);
      this.setState({
        particles: newParticles
      });
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    if (!this.props.active) {
      return <div/>;
    }
    return <div style={{position: 'relative'}}>
      {this.state.particles.map(p => <span style={{ position: 'absolute', transform: `translate(${p.x}px, ${p.y}px)` }}>/</span>)}
    </div>
  }
}

function initParticles() {
  const result = [];
  for (let i = 0; i < COUNT; i++) {
    result.push({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT
    });
  }
  return result;
}

function update(particles) {
  for (const p of particles) {
    p.x = (WIDTH + p.x + MOVE.x * (Math.random()/2 + 0.75)) % WIDTH;
    p.y = (HEIGHT + p.y + MOVE.y * (Math.random()/2 + 0.75)) % HEIGHT;
  }
}

export default connect(state => ({
  active: state.game.raining && !state.game.wipers
}))(Rain);
