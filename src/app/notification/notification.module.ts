import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NotificationComponent } from './components/notification.component';
import { NotifyModalComponent } from './components/notify-modal/notification-modal.component';
import { SearchByPipe } from './pipes/search-by.pipe';
import { NotificationRoutingModule } from './notification-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NotificationRoutingModule
  ],
  providers: [],
  declarations: [NotificationComponent, NotifyModalComponent, SearchByPipe]
})
export class NotificationModule { }
