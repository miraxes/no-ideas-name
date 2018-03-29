import { Color } from './helpers';

export class Bin {
  color: Color;
  rect: string;
  constructor(col: Color) {
    this.color = col;
    this.rect = 'q';
  }

}
