import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-booking',
  templateUrl: 'booking.component.html',
  styleUrls: ['booking.component.scss']
})
export class BookingComponent {

  constructor(public toastController: ToastController) { }

  // private async showErrorToast(message: string): Promise<void> {
  //   const toast = await this.toastController.create({
  //     message: message,
  //     duration: 2000
  //   });
  //   toast.present();
  // }

}
