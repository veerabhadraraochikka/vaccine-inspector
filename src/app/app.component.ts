import { Component } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private platform: Platform, private backgroundMode: BackgroundMode) {
    this.platform.ready().then(() => {
      this.backgroundMode.enable();
    });
  }
}
