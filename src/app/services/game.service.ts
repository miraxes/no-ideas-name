import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Injectable } from '@angular/core';

import { Bin, Bomb, Color, Coordinates, Explosion } from '../model';

@Injectable()
export class GameService {

  counterBins = 0;

  binsSwap$: Observable<Bin[]>;
  bombing$: Observable<Bomb>;
  moving$: Observable<Coordinates>;
  dropping$: Observable<Coordinates>;
  explosion$: Observable<Explosion>;
  finish$: Observable<boolean>;

  private subs: Subscription[] = [];
  private currentBins = [
    new Bin(Color.One),
    new Bin(Color.Two),
    new Bin(Color.Three)
  ];
  private bombGenerator: Subscription = new Subscription();
  private game: Subscription = new Subscription();
  private currentBombTimer = 3000;
  private bombsCount = 120;

  private swapper = new BehaviorSubject<Bin[]>(this.currentBins);
  private bombs = new Subject<Bomb>();
  private moving = new Subject<Coordinates>();
  private dropping = new Subject<Coordinates>();
  private explosion = new Subject<Explosion>();
  private finish = new Subject<boolean>();

  constructor() {
    this.binsSwap$ = this.swapper.asObservable();
    this.bombing$ = this.bombs.asObservable();
    this.moving$ = this.moving.asObservable();
    this.dropping$ = this.dropping.asObservable();
    this.explosion$ = this.explosion.asObservable();
    this.finish$ = this.finish.asObservable();
  }

  startGame(): void {
    this.startCounter();
    this.finish.next(false);
    this.moving.next({ x: 0, y: 0, color: 0, i: 0 });
    this.calculateBombing(this.currentBombTimer);
  }

  finishGame(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.finish.next(true);
    this.game.unsubscribe();
    this.bombGenerator.unsubscribe();
    this.bombsCount = 3;
    this.currentBombTimer = 3000;
  }

  moveBomb(coord: Coordinates): void {
    this.moving.next(coord);
  }

  dropBomb(coord: Coordinates): void {
    this.dropping.next(coord);
  }

  explode(i: number, exp: boolean): void {
    this.explosion.next({ index: i, correct: exp });
  }

  private startCounter(): Subscription {
    return (this.game = Observable.interval(1000).subscribe(() => {
      this.counterBins--;
      if (this.counterBins < 0) {
        this.game.unsubscribe();
        this.initBinsSwapper();
      }
    }));
  }

  private initBinsSwapper(): number {
    this.counterBins = 40;
    this.startCounter();
    return this.subs.push(
      Observable.interval(this.counterBins * 1000).subscribe(() => {
        const tmp = this.currentBins[0].color;
        this.currentBins[0].color = this.currentBins[2].color;
        this.currentBins[2].color = tmp;
        this.swapper.next(this.currentBins);
      })
    );
  }

  private initBombs(): number {
    return this.subs.push(
      Observable.interval(7000)
        .startWith(0)
        .subscribe(() => {
          this.calculateBombing(this.currentBombTimer);
        })
    );
  }

  private calculateBombing(interval: number): Subscription {
    this.bombGenerator.unsubscribe();
    let internalBombCount = 0;
    this.currentBombTimer =
      this.currentBombTimer < 600
        ? (this.currentBombTimer = 500)
        : (this.currentBombTimer -= 200);
    return (this.bombGenerator = Observable.interval(interval)
      .startWith(0)
      .subscribe(() => {
        this.bombsCount--;
        if (++internalBombCount > 3) {
          return this.calculateBombing(this.currentBombTimer);
        }
        this.bombsCount < 0
          ? this.finishGame()
          : this.bombs.next(this.generateBomb());
      }));
  }

  private generateBomb(): Bomb {
    return new Bomb();
  }

  private shuffleArray<T>(array: T[]): T[] {
    const result = array.slice(0);
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
