import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { WebStorageModule } from 'h5webstorage-ngx'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WebStorageModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
