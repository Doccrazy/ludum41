import React from 'react';
import Joyride from 'react-joyride';
import 'react-joyride/lib/react-joyride-compiled.css'

const STEPS = [
  {
    title: 'ASCII Racer tutorial',
    text: <div>
      <p>This tutorial will guide you through the first steps of playing this realtime racing text adventure.</p>
      <p>Click the link on the lower left to get right into the action.</p>
    </div>,
    selector: '.header',
    position: 'bottom'
  },
  {
    title: 'ASCII Racer tutorial',
    text: <div>
      <p>A <b>text adventure</b> is controlled by typing commands into a command prompt and seeing what happens.</p>
      <p>This text adventure runs in <b>real time</b>, so you have limited time to think and decide.</p>
      <p>After the tutorial, you will not need your mouse to play this game.</p>
    </div>,
    selector: 'div.header',
    position: 'bottom'
  },
  {
    title: 'Cockpit view',
    text: <div>
      <p>This is your cockpit. It shows the state of the road around you.</p>
      <p>The windshield shows objects on the <b>3-lane road</b>, the <b>rear-view mirror</b> and the <b>track limits</b>.</p>
      <p>In the side windows, you get a view of the <b>lane beside</b> your car.</p>
    </div>,
    selector: '.game-render'
  },
  {
    title: 'Track limit markers',
    text: <div style={{display: 'flex'}}>
      <div>
        <pre>|</pre><br/>
        <pre>+</pre><br/>
        <pre>|</pre><br/>
        <pre>|</pre><br/>
        <pre style={{color: 'red'}}>&gt;</pre>
      </div>
      <div style={{marginLeft: 20}}>
        The dashed lines left represent the side of the road.<br/>
        If a line is <b>invisible</b>, you are too far away (you will not see the left side when on the right lane).<br/><br/>
        A red arrow indicates a turn in the track, <b>steer accordingly</b>!
      </div>
    </div>,
    selector: 'div.game-render'
  },
  {
    title: 'Input console',
    text: <div>
      <p>This is the <b>console</b>, the main interaction point.</p>
      <p>Type the highlighted commands to play the game.</p>
    </div>,
    selector: '.console'
  },
  {
    title: 'Available commands',
    text: <div>
      <b>speed</b> up/down: Controls car acceleration.<br/>
      <b>brake</b>: Slow down in turns, or you will go off track!<br/>
      <b>gear</b> up/down: Switch gears to keep the engine at optimal RPM, or your engine will overheat!<br/>
      <b>lane</b> left/right: Switch lanes to avoid obstacles.<br/>
      <b>turn</b> left/right: Turn the wheel to get around bends in the track.<br/>
    </div>,
    selector: 'div.console'
  },
  {
    title: 'Console pro tip',
    text: <div>
      Commands may be abbreviated. For example, you can type <b>s u</b> instead of <b>speed up</b> to
      accelerate your car.
    </div>,
    selector: 'body div.console'
  },
  {
    title: 'Command log',
    text: <div>
      <p>Anything that happens in the world is printed here. Read carefully, or you might miss important warnings.</p>
    </div>,
    selector: '.log'
  },
  {
    title: 'Get going',
    text: <div>
      <p>Now, to get into the action, go ahead and type <b>speed up</b> into the console. And try not to hit anything expensive!</p>
    </div>,
    selector: '.console input'
  },
];

export default class Tutorial extends React.Component {
  render() {
    return <Joyride
      ref="joyride"
      steps={STEPS}
      run // or some other boolean for when you want to start it
      autoStart
      debug={false}
      showSkipButton
      type="continuous"
      locale={{ back: 'Back', close: 'Close', last: 'Start game', next: 'Next', skip: 'I know my way around text adventures' }}
    />
  }
}
