import cockpit from './res/cockpit.txt'
import {escapeHtml} from "./utils";

const COCKPIT_TMPL = escapeHtml(cockpit);

export function processTemplate(template, context) {
  return template.replace(/\${(\w+)(?:\[(\d+)])?\s*(\w+)?}/g, function(match, varName, line, align) {
    const len = match.length;
    let str = context[varName];
    if (typeof str === "string") {
      str = str.split('\n');
    } else if (typeof str === "number") {
      str = [str + ''];
    }
    const lineStr = ((str || [])[line || 0] || '').substr(0, len);
    if (align === "c") {
      const wsAdd = len - lineStr.length;
      return ' '.repeat(Math.trunc(wsAdd/2)) + lineStr + ' '.repeat(wsAdd - Math.trunc(wsAdd/2));
    } else if (align === "r") {
      return lineStr.padStart(len);
    }
    return lineStr.padEnd(len);
  })
}

const TRACK_0 = 15;
export function renderTrack(template, gameState) {
  return template.split('\n').map((row, ln) => {
    const symbol = (ln - gameState.position) % 3 === 0 ? '+' : '|';
    const actualPos = gameState.position + (TRACK_0 - ln);
    let object = null;
    for (const obj of gameState.objects) {
      if (obj.renderTrack && obj.position === actualPos) {
        object = obj;
      }
    }
    return row.replace('L', object ? object.renderTrack(0) : symbol).replace('R', object ? object.renderTrack(0) : symbol);
  }).join('\n');
}

const CONTEXT = { lane0: [], lane1: [], lane2: []};

export function renderAll(gameState) {
  const context = CONTEXT;
  for (let laneIdx = 0; laneIdx < 3; laneIdx++) {
    const lane = context[`lane${laneIdx}`];
    for (let i = 0; i < 9; i++) {
      const actualPos = gameState.position + i;
      lane[i] = null;
      for (const obj of gameState.objects) {
        if (obj.render && obj.position === actualPos && obj.lane === laneIdx) {
          lane[i] = obj.render();
          if (!obj.html && lane[i]) {
            lane[i] = escapeHtml(lane[i]);
          }
        }
      }
    }
  }
  context.speed = 45;
  context.rpm = 4500;
  return renderTrack(processTemplate(COCKPIT_TMPL, context), gameState);
}

// const STATE = {
//   rearMirror: 'Foobar',
//   sideLeft: 'Line 1\nLine 2',
//   sideRight: 'Line 1\nLine 2',
//   left: ['An ancient grandmother', null, null, null, null, null, 'Opponent 1'],
//   right: 'A sharp right turn\n\nA puddle',
//   center: 'A huge tree\nYour mom',
//   speed: 45,
//   rpm: 4500
// };
