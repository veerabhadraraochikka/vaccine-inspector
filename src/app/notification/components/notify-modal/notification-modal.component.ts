import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-notification',
  templateUrl: 'notification-modal.component.html',
  styleUrls: ['notification-modal.component.scss']
})
export class NotifyModalComponent implements OnInit {

  @Input() center: any;
  minDate: any;
  maxDate: any;
  intervals: any = [{ value: 5, key: '5 Minutes' },
  { value: 10, key: '10 Minutes' },
  { value: 15, key: '15 Minutes' },
  { value: 30, key: '30 Minutes' },
  { value: 60, key: '1 Hour' },
  { value: 360, key: '6 Hours' },
  { value: 1440, key: 'Day' }];

  constructor(public modalController: ModalController,
    public toastController: ToastController) {
    this.minDate = moment().format('YYYY-MM-DD');
    this.maxDate = moment().add(10, 'days').format('YYYY-MM-DD');
  }

  ngOnInit(): void {
    this.center.intervalDuration = 10;
    this.center.notifyTillDate = moment().add(1, 'days').format('YYYY-MM-DD');
  }

  async registerNotify(): Promise<void> {
    localStorage.setItem(this.center['center_id'], JSON.stringify(this.center));
    const toast = await this.toastController.create({
      message: 'Vaccine Center Slot will be Notified',
      duration: 500,
      position: 'top'
    });
    toast.present();
    this.modalController.dismiss({
      'dismissed': true
    })
  }
}