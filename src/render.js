import cockpit from './res/cockpit.txt'
import wheelLeft from './res/wheelLeft.txt'
import wheelStraight from './res/wheelStraight.txt'
import wheelRight from './res/wheelRight.txt'
import {escapeHtml, setCharAt} from "./utils";
import {getPlayer} from "./actions/game";

const COCKPIT_TMPL = cockpit.replace(/^(\r?\n)+/, '').replace(/(\r?\n)+$/, '');

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
    const symbol = (ln - getPlayer(gameState).position) % 3 === 0 ? '+' : '|';
    const actualPos = getPlayer(gameState).position + (TRACK_0 - ln);
    const playerLane = getPlayer(gameState).lane;
    let object = null;
    for (const obj of gameState.objects) {
      if (obj.renderTrack && obj.position === actualPos) {
        object = obj;
      }
    }
    const showLeft = playerLane <= 1;
    const showRight = playerLane >= 1;
    return row
      .replace(/</g, showLeft ? '.' : ' ')
      .replace(/>/g, showRight ? '.' : ' ')
      .replace('#', showLeft ? (object ? object.renderTrack(0) : symbol) : ' ')
      .replace('#', showRight ? (object ? object.renderTrack(0) : symbol) : ' ');
  }).join('\n');
}

function renderWheel(template, gameState) {
  const wheel = getPlayer(gameState).turn < 0 ? wheelLeft : (getPlayer(gameState).turn > 0 ? wheelRight : wheelStraight);
  const wheelLines = wheel.split(/\r?\n/);
  let colPos, startRow;
  return template.split('\n').map((row, ln) => {
    if (!colPos || colPos < 0) {
      colPos = row.indexOf('%');
      if (colPos >= 0) {
        startRow = ln;
        row = setCharAt(row, colPos, ' ');
      }
    }
    if (colPos >= 0) {
      const wheelRow = wheelLines[ln - startRow];
      if (wheelRow) {
        const chars = wheelRow.split('');
        for (let i = 0; i < chars.length; i++) {
          if (chars[i] !== ' ') {
            row = setCharAt(row, colPos + i, chars[i]);
          }
        }
      }
    }
    return row;
  }).join('\n');
}

function getRearMirrorText(gameState) {
  const items = [];
  const playerPos = getPlayer(gameState).position;
  for (const obj of gameState.objects) {
    if (obj.renderRear && obj.position < playerPos && obj.position > playerPos - 5) {
      obj.renderRear(gameState, items);
    }
  }
  items.sort((i1, i2) => (i2.order || 0) - (i1.order || 0));
  return items.length ? items[0].text : '';
}

const CONTEXT = { lane0: [], lane1: [], lane2: []};

export function renderAll(gameState) {
  const player = getPlayer(gameState);
  if (!player) {
    return;
  }
  const context = CONTEXT;
  renderLanes(context, gameState);
  context.speed = Math.trunc(player.speed * 30);
  context.rpm = player.rpm;
  context.rearMirror = getRearMirrorText(gameState);

  let result = renderWheel(COCKPIT_TMPL, gameState);
  result = renderTrack(result, gameState);
  result = processTemplate(result, context);
  return result;
}

function renderLanes(context, gameState) {
  const player = getPlayer(gameState);
  for (let laneIdx = 0; laneIdx < 3; laneIdx++) {
    const lane = context[`lane${laneIdx}`];
    for (let i = 1; i < 10; i++) {
      const actualPos = player.position + i;
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
}
