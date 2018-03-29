import { Color } from './helpers';

export class Bomb {
  color: Color;
  lifetime: number;

  constructor() {
    this.color = this.randomColor();
    this.lifetime = Math.floor(Math.random() * (11 - 5)) + 5;
  }

  private randomColor(): Color {
    return (Math.random() > .33) ? (Math.random() > .66) ? Color.One : Color.Two : Color.Three;
  }
}
