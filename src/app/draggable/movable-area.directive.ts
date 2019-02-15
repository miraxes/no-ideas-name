import { Subscription } from 'rxjs/Subscription';

import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  QueryList
} from '@angular/core';

import { MovableDirective } from './movable.directive';

interface Boundaries {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

@Directive({
  selector: '[appMovableArea]'
})
export class MovableAreaDirective implements AfterContentInit {
  @ContentChildren(MovableDirective) movables: QueryList<MovableDirective>;

  private boundaries: Boundaries;
  private subscriptions: Subscription[] = [];

  constructor(private element: ElementRef) {}

  ngAfterContentInit(): void {
    this.movables.changes.subscribe(() => {
      this.subscriptions.forEach(s => s.unsubscribe());

      this.movables.forEach(movable => {
        this.subscriptions.push(
          movable.dragStart.subscribe(() => this.measureBoundaries(movable))
        );
        this.subscriptions.push(
          movable.dragMove.subscribe(() => this.maintainBoundaries(movable))
        );
      });
    });
  }

  private measureBoundaries(movable: MovableDirective): void {
    const viewRectangle: ClientRect = this.element.nativeElement.getBoundingClientRect();
    const movableClientRect: ClientRect = movable.element.nativeElement.getBoundingClientRect();

    this.boundaries = {
      minX: viewRectangle.left - movableClientRect.left + movable.position.x,
      maxX: viewRectangle.right - movableClientRect.right + movable.position.x,
      minY: viewRectangle.top - movableClientRect.top + movable.position.y,
      maxY: viewRectangle.bottom - movableClientRect.bottom + movable.position.y
    };
  }

  private maintainBoundaries(movable: MovableDirective): void {
    movable.position.x = Math.max(this.boundaries.minX, movable.position.x);
    movable.position.x = Math.min(this.boundaries.maxX, movable.position.x);
    movable.position.y = Math.max(this.boundaries.minY, movable.position.y);
    movable.position.y = Math.min(this.boundaries.maxY, movable.position.y);
  }
}
