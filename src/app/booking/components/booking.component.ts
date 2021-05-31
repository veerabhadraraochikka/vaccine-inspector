import { Component } from '@angular/core';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-booking',
  templateUrl: 'booking.component.html',
  styleUrls: ['booking.component.scss']
})
export class BookingComponent {

  constructor(public toastController: ToastController) { }

  async launchAarogyasetuApp(): Promise<void> {
    const options: AppLauncherOptions = {};
    options.packageName = 'nic.goi.aarogyasetu'
    await AppLauncher.canLaunch(options).then(() => {
      AppLauncher.launch(options);
    }).catch(() => {
      this.showErrorToast('AarogyaSetu App Not Found.');
    });
  }

  async launchUmangApp(): Promise<void> {
    const options: AppLauncherOptions = {};
    options.packageName = 'in.gov.umang.negd.g2c'
    await AppLauncher.canLaunch(options).then(() => {
      AppLauncher.launch(options);
    }).catch(() => {
      this.showErrorToast('UMANG App Not Found.');
    });
  }

  private async showErrorToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
