import {getPlayer, TIME_SCALE} from "../actions/game";
import {MAX_SPEED, SPEED_SCALE} from "./Player";
import {getRandomInt} from "../utils";
import Turn from "./Turn";

const ACCEL = 0.35;

export default class Opponent {
  number;
  position = 0;
  floatPosition = 0;
  lane;
  speed = 0;
  skill = Math.random() + 0.5;

  constructor(number, position, lane) {
    this.number = number;
    this.position = position;
    this.lane = lane;
  }

  render() {
    return `Opponent ${this.number}`;
  }

  renderRear(gameState, items) {
    const existing = items.find(i => i.opponent);
    if (existing) {
      existing.count = (existing.count || 1) + 1;
      existing.text = `${existing.count} opponents`;
    } else {
      items.push({text: this.render(), order: 10, opponent: true});
    }
  }

  update(state) {
    const player = getPlayer(state);
    if (player.speed <= 0) {
      return;
    }
    let accel;
    const dist = this.position - player.position;
    if (dist < -5) {
      accel = ACCEL;
    } else if (dist > 5) {
      accel = -ACCEL;
    } else {
      accel = player.realAccel();
    }

    if ((dist <= 0 && dist > -3 && this.lane === player.lane)
      || (dist > 1 && Math.random() < 0.01)) {
      if (this.lane === 1) {
        this.lane = this.lane + (getRandomInt(2)*2 - 1);
      } else {
        this.lane = 1;
      }
    }

    this.speed = Math.min(MAX_SPEED, Math.max(0, this.speed + TIME_SCALE*accel*this.skill*Math.random()*2));
    this.floatPosition = this.floatPosition + TIME_SCALE*SPEED_SCALE*this.speed;
    this.position = Math.trunc(this.floatPosition);
  }

  hit(other) {
    if (this.lastHit === this.position) {
      return;
    }
    if ((other.gameOver || other.damage)) {
      console.log("Hit damage");
      this.speed *= 0.5;
      this.lastHit = this.position;
    } else if (other instanceof Turn) {
      console.log("Hit turn");
      this.speed *= 0.75;
      this.lastHit = this.position;
    }
  }
}
