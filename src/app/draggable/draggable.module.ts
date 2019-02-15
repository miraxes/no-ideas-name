import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DraggableDirective } from './draggable.directive';
import { MovableAreaDirective } from './movable-area.directive';
import { MovableDirective } from './movable.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [DraggableDirective, MovableDirective, MovableAreaDirective],
  exports: [DraggableDirective, MovableDirective, MovableAreaDirective]
})
export class DraggableModule {}
