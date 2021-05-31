import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NotificationComponent } from './components/notification.component';
import { NotificationRoutingModule } from './notification-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NotificationRoutingModule
  ],
  declarations: [NotificationComponent]
})
export class NotificationModule { }
