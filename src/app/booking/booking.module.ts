import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingComponent } from './components/booking.component';

import { BookingRoutingModule } from './booking-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BookingRoutingModule,
  ],
  declarations: [BookingComponent]
})
export class BookingModule { }
