import 'rxjs/add/operator/take';
import 'rxjs/add/observable/timer';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Bomb, Color } from '../../model';

@Component({
  selector: 'app-bomb',
  templateUrl: './bomb.component.html'
})
export class BombComponent implements OnInit {
  @Input() bomb: Bomb;
  @Output() destroy = new EventEmitter<void>();
  timeLeft: number;
  sub: Subscription;
  Color = Color;

  constructor() { }

  ngOnInit(): void {
    this.timeLeft = this.bomb.lifetime;
    this.sub = Observable
      .interval(1000)
      .take(this.bomb.lifetime)
      .subscribe(() => {
        this.timeLeft--;
      });
    Observable
      .timer(1000 * this.bomb.lifetime)
      .take(1)
      .subscribe(() => this.boom());
  }

  private boom(): void {
    this.sub.unsubscribe();
    this.destroy.emit();
  }
}
