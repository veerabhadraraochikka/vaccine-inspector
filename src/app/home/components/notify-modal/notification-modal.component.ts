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

  minDate: any;
  maxDate: any;
  intervals: any = [{ value: 5, key: '5 Minutes' },
  { value: 10, key: '10 Minutes' },
  { value: 15, key: '15 Minutes' },
  { value: 30, key: '30 Minutes' },
  { value: 60, key: '1 Hour' },
  { value: 360, key: '6 Hours' },
  { value: 1440, key: 'Day' }];
  notify: any;

  constructor(public modalController: ModalController,
    public toastController: ToastController) {
    this.minDate = moment().format('YYYY-MM-DD');
    this.maxDate = moment().add(10, 'days').format('YYYY-MM-DD');
  }

  ngOnInit(): void {
    const defaults = { intervalDuration: 10, notifyTillDate: moment().add(1, 'days').format('YYYY-MM-DD') };
    this.notify = JSON.parse(localStorage.getItem('NOTIFY') || JSON.stringify(defaults));
  }

  openDatePicker(): void {
    datePicker.present({
      mode: 'date',
      min: this.minDate,
      max: this.maxDate,
      date: this.notify.notifyTillDate
    } as DatePickerOptions).then((date) => {
      this.notify.notifyTillDate = moment(date as any).format('YYYY-MM-DD');
    });
  }

  async saveNotify(): Promise<void> {
    localStorage.setItem('NOTIFY', JSON.stringify(this.notify));
    const toast = await this.toastController.create({
      message: 'Vaccine Center Slot will be Notified',
      duration: 500,
      position: 'top'
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