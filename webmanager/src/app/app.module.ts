import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APICallerService } from './services/apicaller.service';
import { CallbackPipe } from './pipes/callback.pipe';
import { ActionbarService } from './services/actionbar.service';
import { ActionbarComponent } from './components/actionbar/actionbar.component';
import { MaterialModule } from './modules/material/material.module';
import { SortByPipe } from './pipes/sortby.pipe';
import { DialogComponent } from './components/dialog/dialog.component';
import { StringToObjectFilterPipe } from './pipes/string2objectfilter.pipe';
import { FormsModule } from '@angular/forms';


@NgModule({ declarations: [
        AppComponent,
        CallbackPipe,
        SortByPipe,
        ActionbarComponent,
        DialogComponent,
        StringToObjectFilterPipe
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MaterialModule,
        FormsModule], providers: [APICallerService, HttpClient, ActionbarService, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
