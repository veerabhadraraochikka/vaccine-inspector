import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home.component';

import { HomeRoutingModule } from './home-routing.module';
import { SearchByPipe } from './pipes/search-by.pipe';
import { NotifyModalComponent } from './components/notify-modal/notification-modal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent, SearchByPipe, NotifyModalComponent]
})
export class HomeModule { }
