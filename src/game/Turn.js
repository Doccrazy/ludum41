export default class Turn {
  constructor(pos, dir) {
    this.position = pos;
    this.direction = dir;
  }

  renderTrack(side) {
    return `<span class="sign">${this.direction === 'r' ? '&gt;' : '&lt;'}</span>`;
  }
}
