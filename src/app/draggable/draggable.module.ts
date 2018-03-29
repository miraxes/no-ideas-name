import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableDirective } from './draggable.directive';
import { MovableDirective } from './movable.directive';
import { MovableAreaDirective } from './movable-area.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DraggableDirective, MovableDirective, MovableAreaDirective],
  exports: [DraggableDirective, MovableDirective, MovableAreaDirective]
})
export class DraggableModule { }
