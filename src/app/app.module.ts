import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DraggableModule } from './draggable';

import { AppComponent } from './app.component';
import { COMPONENTS } from './components';
import { SERVICES } from './services';

@NgModule({
  declarations: [
    AppComponent,
    ...COMPONENTS
  ],
  imports: [
    BrowserModule,
    DraggableModule
  ],
  providers: [...SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule { }
