import 'rxjs/add/operator/takeUntil';

import { Subject } from 'rxjs/Subject';

import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Bin, Color } from '../../model';
import { Coordinates } from '../../model/helpers';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html'
})
export class BinComponent implements OnInit, OnDestroy {
  @Input() bin: Bin;
  @HostBinding('class.activated')
  Color = Color;
  hover: boolean;

  private rectangle: ClientRect;

  private destroy$: Subject<boolean> = new Subject();

  constructor(private element: ElementRef, private game: GameService) { }

  ngOnInit(): void {
    this.rectangle = this.element.nativeElement.getBoundingClientRect();
    this.game.binsSwap$.takeUntil(this.destroy$).subscribe(() => {
      this.rectangle = this.element.nativeElement.getBoundingClientRect();
    });

    this.game.moving$.takeUntil(this.destroy$).subscribe(coordinates => {
      this.hover = this.isBins(coordinates) && this.isCorrectBin(coordinates);
    });

    this.game.dropping$.takeUntil(this.destroy$).subscribe(coordinates => {
      if (this.isBins(coordinates)) {
        this.hover = false;
        this.game.explode(coordinates.i, this.isCorrectBin(coordinates));
      }
    });
  }

  private isBins(coord: Coordinates): boolean {
    return (
      this.rectangle.left < coord.x &&
      coord.x < this.rectangle.right &&
      this.rectangle.top < coord.y &&
      coord.y < this.rectangle.bottom
    );
  }

  private isCorrectBin(coord: Coordinates): boolean {
    return coord.color === this.bin.color;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
