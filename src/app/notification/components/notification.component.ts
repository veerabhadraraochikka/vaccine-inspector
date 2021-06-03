import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import * as moment from 'moment';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NotifyModalComponent } from './notify-modal/notification-modal.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-notification',
  templateUrl: 'notification.component.html',
  styleUrls: ['notification.component.scss']
})
export class NotificationComponent implements OnInit {

  states: any = [];
  districts: any = [];
  centers: any = [];
  statevalue: any = '';
  districtValue: any = '';
  dateValue: string;
  maxDate: string;
  minDate: string;
  selectedCenter: string;
  loading: any;
  search: any = {
    show: false,
    input: '',
    ageLimit: 'All',
    onlyAvailable: false
  }
  ageLimts: any = ['All', '18 - 44', '45+']

  constructor(
    private readonly notificationService: NotificationService,
    private readonly loadingController: LoadingController,
    public toastController: ToastController,
    private localNotifications: LocalNotifications,
    public modalController: ModalController) {
    this.minDate = moment().format('YYYY-MM-DD');
    this.dateValue = this.minDate;
    this.maxDate = moment().add(10, 'days').format('YYYY-MM-DD');
  }

  async showLoading(): Promise<any> {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
    return await this.loading.present();
  }

  hideLoading(): void {
    this.loading.dismiss();
  }

  async ngOnInit(): Promise<void> {
    await this.showLoading();
    this.notificationService.getStates().pipe(take(1)).subscribe((data) => {
      this.hideLoading();
      this.states = data;
    });
  }

  async onStateChange({ detail }: any): Promise<void> {
    await this.showLoading();
    this.districtValue = '';
    this.centers = [];
    this.notificationService.getDistricts(detail.value).pipe(take(1)).subscribe((data) => {
      this.hideLoading();
      this.districts = data;
      this.getCenters();
    });
  }

  onDistrictChange({ detail }: any): void {
    this.getCenters();
  }

  onDateChange({ detail }: any): void {
    this.getCenters();
  }

  async registerNotify(): Promise<void> {
    const modal = await this.modalController.create({
      component: NotifyModalComponent,
      cssClass: 'notify-modal-component',
      swipeToClose: true,
      componentProps: {
        center: {
          date: this.dateValue,
          state_name: this.selectedCenter['state_name'],
          state_id: this.statevalue,
          district_name: this.selectedCenter['district_name'],
          district_id: this.districtValue,
          center_name: this.selectedCenter['name'],
          pincode: this.selectedCenter['pincode'],
          fee_type: this.selectedCenter['fee_type'],
          center_id: this.selectedCenter['center_id']
        }
      }
    });
    modal.present();
  }

  private async getCenters(): Promise<void> {
    this.centers = [];
    this.selectedCenter = undefined;
    setTimeout(async () => {
      if (this.dateValue && this.districtValue && this.statevalue) {
        await this.showLoading();
        this.notificationService.getCenters(this.districtValue, moment(this.dateValue).format('DD-MM-YYYY')).pipe(take(1)).subscribe((data) => {
          this.hideLoading();
          this.centers = data;
        });
      }
    })
  }
}