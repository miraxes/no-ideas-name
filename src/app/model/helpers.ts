export enum Color {
  One,
  Two,
  Three
}

export interface Coordinates {
  x: number;
  y: number;
  i: number;
  color: Color;
}

export interface Explosion {
  index: number;
  correct: boolean;
}

export enum GameMode {
  Start,
  InProgress,
  Finished
}
