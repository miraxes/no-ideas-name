import { Color } from './helpers';

export class Bomb {
  color: Color;
  lifetime: number;

  constructor() {
    this.color = this.randomColor();
    this.lifetime = this.randomLifeTime();
  }

  private randomColor(): Color {
    return Math.random() > 0.33
      ? Math.random() > 0.66
        ? Color.One
        : Color.Two
      : Color.Three;
  }

  private randomLifeTime(): number {
    return Math.floor(Math.random() * (11 - 5)) + 5;
  }
}
