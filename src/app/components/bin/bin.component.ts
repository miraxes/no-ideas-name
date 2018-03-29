import { Component, OnInit, Input, HostListener, ElementRef, HostBinding, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/takeUntil';

import { Color, Bin } from '../../model';
import { GameService } from '../../services/game.service';

@Component({
    selector: 'app-bin',
    templateUrl: './bin.component.html'
})
export class BinComponent implements OnInit, OnDestroy {
    Color = Color;
    @Input() bin: Bin;
    @HostBinding('class.activated')
    hover: boolean;

    private rect: ClientRect;

    private destroy$: Subject<boolean> = new Subject();

    constructor(private element: ElementRef, private game: GameService) {
    }

    ngOnInit() {
      this.rect = this.element.nativeElement.getBoundingClientRect();
      this.game.binsSwap$.takeUntil(this.destroy$).subscribe(_ => {
        this.rect = this.element.nativeElement.getBoundingClientRect();
      });
      this.game.moving$.takeUntil(this.destroy$).subscribe(crd => {
        this.hover = this.isBins(crd) && this.isCorrectBin(crd);
      });

      this.game.dropping$.takeUntil(this.destroy$).subscribe(crd => {
        if (this.isBins(crd)) {
          this.hover = false;
          this.game.explode(crd.i, this.isCorrectBin(crd));
        }
      });
    }

    ngOnDestroy() {
      this.destroy$.next(true);
      this.destroy$.complete();
    }

    private isBins(coord) {
      return this.rect.left < coord.x && coord.x < this.rect.right &&
                   this.rect.top < coord.y && coord.y < this.rect.bottom;
    }

    private isCorrectBin(coord) {
      return coord.color === this.bin.color;
    }

}
