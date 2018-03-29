import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/timer';
import { Color, Bomb } from '../../model';

@Component({
    selector: 'app-bomb',
    templateUrl: './bomb.component.html'
})
export class BombComponent implements OnInit {
    @Input() bomb: Bomb;
    timeLeft: number;
    sub: Subscription;
    @Output() destroy = new EventEmitter<void>();
    Color = Color;
    constructor() {
    }

    ngOnInit() {
      this.timeLeft = this.bomb.lifetime;
      this.sub = Observable.interval(1000).take(this.bomb.lifetime).subscribe(_ => {
        this.timeLeft--;
      });
      Observable.timer(1000 * this.bomb.lifetime).take(1).subscribe(_ => this.boom());
    }

    boom() {
      this.sub.unsubscribe();
      this.destroy.emit();
    }

}
