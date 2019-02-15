import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { COMPONENTS } from './components';
import { DraggableModule } from './draggable';
import { SERVICES } from './services';

@NgModule({
  declarations: [AppComponent, ...COMPONENTS],
  imports: [BrowserModule, DraggableModule],
  providers: [...SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule {}
