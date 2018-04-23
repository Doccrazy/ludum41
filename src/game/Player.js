import {shakeScreen, TIME_SCALE} from "../actions/game";
import store from '../store'
import {writeLog} from "../actions/log";

export const GEARS = [7000, 3000, 1500, 700];
const OVERHEAT_SECS = 10;
export const MAX_SPEED = 6.5;
const OFFTRACK_SPEED = 0.5;
const ACCEL_SCALE = 0.25;  // i.e. progression speed
export const SPEED_SCALE = 0.2;  // i.e. max game speed
const TURN_LANE_DELAY = 4;  // time until you change lane when turned on a straight

export default class Player {
  position = 0;
  floatPosition = 0;
  lane = 1;
  speed = 0;
  accel = 0;
  rpm = 0;
  gear = 0;
  engineHeat = 0;
  turn = 0;
  turnTimer = 0;

  constructor(lane) {
    this.lane = lane;
  }

  update(state) {
    this.rpm = Math.trunc(this.speed * GEARS[this.gear]);
    // off track
    if (this.isOffTrack()) {
      if (!this.offTrackWarning) {
        setTimeout(() => store.dispatch(writeLog('Your car is making an involuntary trip to the countryside.', 'warning')));
      }
      this.offTrackWarning = true;
    } else {
      this.offTrackWarning = false;
    }

    const accel = this.realAccel();
    this.speed = Math.min(MAX_SPEED, Math.max(0, this.speed + TIME_SCALE*ACCEL_SCALE*accel));
    this.floatPosition = this.floatPosition + TIME_SCALE*SPEED_SCALE*this.speed;
    this.position = Math.trunc(this.floatPosition);

    const oldHeat = this.engineHeat;
    if (this.rpm > 5500) {
      this.engineHeat = Math.min(1, this.engineHeat + TIME_SCALE*(1/OVERHEAT_SECS));
    } else {
      this.engineHeat = Math.max(0, this.engineHeat - TIME_SCALE*(1/OVERHEAT_SECS));
    }
    if (oldHeat < 0.5 && this.engineHeat > 0.5) {
      setTimeout(() => store.dispatch(writeLog(`WARNING! Your engine is overheating! Use 'speed 0' to hold speed.`, 'warning')));
    }
    if (oldHeat < 1 && this.engineHeat >= 1) {
      setTimeout(() => store.dispatch(writeLog(`BOOOOM! Your engine just exploded. Enjoy your day.`, 'error')));
      setTimeout(() => store.dispatch(shakeScreen()));
      this.engineDead = true;
    }

    if (this.turn && this.speed > 0) {
      this.turnTimer += TIME_SCALE;
      if (this.turnTimer > TURN_LANE_DELAY * (0.25 + 0.75 * (MAX_SPEED - this.speed)/MAX_SPEED)) {
        this.moveLane(this.turn, 'The sloppy positioning of the steering wheel threw you $dest.');
        this.turnTimer = 0;
      }
    } else {
      this.turnTimer = 0;
    }
  }

  realAccel() {
    let accel = this.accel;
    if (accel > 0) {
      // rpm cutoff
      if (this.rpm > 6000) {
        accel = 0;
        // engine stall
      } else if (this.rpm < 750) {
        accel = accel * 0.25;
      } else if (this.rpm < 1500 || this.rpm > 5000) {
        accel = accel * 0.5;
      }
      // less accel on higher speeds
      accel = accel * (MAX_SPEED - this.speed) / MAX_SPEED;
    }
    // engine break
    if (this.rpm > 6100 || this.engineDead || (this.rpm > 5500 && this.accel === 0)) {
      accel = -0.75;
    }
    // off track
    if (this.isOffTrack() && this.speed > OFFTRACK_SPEED) {
      accel = -2;
    }
    return accel;
  }

  hit(other) {
    if (other.gameOver) {
      this.speed = 0;
      this.rpm = 0;
      this.accel = 0;
      setTimeout(() => store.dispatch(shakeScreen()));
    } else if (other.damage) {
      this.speed = this.speed * 0.5;
      setTimeout(() => store.dispatch(shakeScreen()));
    }
  }

  setLane(lane) {
    this.lane = Math.max(Math.min(lane, 3), -1);
  }

  moveLane(delta, announce) {
    const oldLane = this.lane;
    this.setLane(this.lane + delta);
    if (announce && oldLane !== this.lane) {
      const dest = this.isOffTrack() ? 'off track' : `to lane ${this.lane + 1}`;
      setTimeout(() => store.dispatch(writeLog(announce.replace('$dest', dest))));
    }
  }

  isOffTrack() {
    return this.lane < 0 || this.lane > 2
  }
}
