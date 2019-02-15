import { Subscription } from 'rxjs/Subscription';

import { Component, OnInit } from '@angular/core';

import { Bin, Bomb, GameMode } from './model';
import { GameService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  score: number;
  mode = GameMode;
  gameMode: GameMode;
  bins: Bin[] = [];
  bombs: Bomb[] = [];

  private subs: Subscription[] = [];

  constructor(public game: GameService) {}

  ngOnInit(): void {
    this.gameMode = GameMode.Start;
    this.score = 0;
  }

  boomBomb(index: number, defused: boolean = false): void {
    this.bombs.splice(index, 1);
    if (defused) {
      ++this.score;
    } else {
      --this.score;
    }
  }

  moving(e: PointerEvent, index: number, bomb: Bomb): void {
    this.game.moveBomb({ x: e.x, y: e.y, i: index, color: bomb.color });
  }

  drop(e: PointerEvent, index: number, bomb: Bomb): void {
    this.game.dropBomb({ x: e.x, y: e.y, i: index, color: bomb.color });
  }

  start(): void {
    this.gameMode = GameMode.InProgress;
    this.subs.push(
      this.game.binsSwap$.subscribe(swapper => {
        this.bins = swapper;
      })
    );
    this.subs.push(
      this.game.binsSwap$.subscribe(swapper => {
        this.bins = swapper;
      })
    );
    this.subs.push(
      this.game.bombing$.subscribe(b => {
        this.bombs.push(b);
      })
    );
    this.subs.push(
      this.game.explosion$.subscribe(exp => {
        this.boomBomb(exp.index, exp.correct);
      })
    );
    this.subs.push(
      this.game.finish$.subscribe(rdy => {
        if (rdy) {
          this.finish();
        }
      })
    );
    this.game.startGame();
  }

  restart(): void {
    this.finish();
    this.gameMode = GameMode.Start;
    this.score = 0;
    this.bins = [];
    this.bombs = [];
    this.game.finishGame();
  }

  private finish(): void {
    this.gameMode = GameMode.Finished;
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
