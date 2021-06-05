import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';

import { DatePickerPluginInterface, DatePickerOptions } from '@capacitor-community/date-picker';
import { Plugins } from '@capacitor/core';

const datePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;
@Component({
  selector: 'app-notification',
  templateUrl: 'notification-modal.component.html',
  styleUrls: ['notification-modal.component.scss']
})
export class NotifyModalComponent implements OnInit {

  intervals: any = [{ value: 2, key: '2 Minutes' },
  { value: 5, key: '5 Minutes' },
  { value: 10, key: '10 Minutes' },
  { value: 15, key: '15 Minutes' },
  { value: 30, key: '30 Minutes' },
  { value: 60, key: '1 Hour' },
  { value: 360, key: '6 Hours' },
  { value: 1440, key: 'Day' }];
  notify: any;

  constructor(public modalController: ModalController,
    public toastController: ToastController) { }

  ngOnInit(): void {
    const defaults = { intervalDuration: 10, notifyTillDate: moment().add(5, 'days').format('YYYY-MM-DD') };
    this.notify = JSON.parse(localStorage.getItem('NOTIFY') || JSON.stringify(defaults));
  }

  openDatePicker(): void {
    datePicker.present({
      mode: 'date',
      min: moment().toISOString(),
      date: this.notify.notifyTillDate + 'T00:00:00.000Z',
      max: moment().add(10, 'days').toISOString()
    } as DatePickerOptions).then((date) => {
      date.value && (this.notify.notifyTillDate = moment(date.value).format('YYYY-MM-DD'))
    });
  }

  async saveNotify(): Promise<void> {
    localStorage.setItem('NOTIFY', JSON.stringify(this.notify));
    const toast = await this.toastController.create({
      message: 'You will be notified when vaccine available',
      duration: 1000,
      position: 'middle'
    });
    toast.present();
    this.modalController.dismiss('R');
  }

  dismissModal(): void {
    this.modalController.dismiss(null);
  }

  stopNotify(): void {
    this.modalController.dismiss('S');
  }
}