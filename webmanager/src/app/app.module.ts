import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APICallerService } from './services/apicaller.service';
import { CallbackPipe } from './pipes/callback.pipe';
import { ActionbarService } from './services/actionbar.service';
import { ActionbarComponent } from './components/actionbar/actionbar.component';
import { MaterialModule } from './modules/material/material.module';
import { MydatatableComponent } from './components/mydatatable/component/mydatatable.component';
import { SortByPipe } from './pipes/sortby.pipe';
import { DialogComponent } from './components/dialog/dialog.component';
import { StringToObjectFilterPipe } from './pipes/string2objectfilter.pipe';
import { Nl2BrPipe, Nl2BrPipeModule } from 'nl2br-pipe';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    CallbackPipe,
    SortByPipe,
    ActionbarComponent,
    MydatatableComponent,
    DialogComponent, 
    StringToObjectFilterPipe
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    Nl2BrPipeModule
  ],
  providers: [APICallerService, HttpClient, ActionbarService],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule { }
