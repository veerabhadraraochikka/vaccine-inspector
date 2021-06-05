import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [HttpClientModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [LocalNotifications, BackgroundMode, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
