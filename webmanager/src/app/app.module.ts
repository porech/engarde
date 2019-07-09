import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APICallerService } from './services/apicaller.service';
import { CallbackPipe } from './pipes/callback.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CallbackPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [APICallerService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
