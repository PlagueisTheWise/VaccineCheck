import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { VaccineService } from '../app/services/vaccine.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Platform } from "@ionic/angular";
import { HTTP } from '@ionic-native/http/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, VaccineService, HttpClient, HTTP, Platform, LocalNotifications],
  bootstrap: [AppComponent],
})
export class AppModule {}
