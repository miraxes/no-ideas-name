import { Color } from './helpers';

export class Bin {
  color: Color;
  rectangle: string;

  constructor(color: Color) {
    this.color = color;
    this.rectangle = 'q';
  }
}
