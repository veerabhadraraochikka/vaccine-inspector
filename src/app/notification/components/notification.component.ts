import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import * as moment from 'moment';
import { LoadingController, ToastController } from '@ionic/angular';
import { take } from 'rxjs/operators';

import { DatePickerPluginInterface, DatePickerOptions } from '@capacitor-community/date-picker';
import { Plugins } from '@capacitor/core';

const datePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;
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
  selectedCenter: string;
  loading: any;
  search: any = {
    show: false,
    input: '',
    ageLimit: 'All',
    onlyAvailable: false,
    showSlots: false
  }
  showSlots: boolean = false;
  ageLimts: any = ['All', '18 - 44', '45+'];
  interfaceOptions = { header: 'Age Limit' };

  constructor(
    private readonly notificationService: NotificationService,
    private readonly loadingController: LoadingController,
    private readonly toastController: ToastController) {
    this.dateValue = moment().format('YYYY-MM-DD');
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

  openDatePicker(): void {
    datePicker.present({
      mode: 'date',
      min: moment().toISOString(),
      date: this.dateValue + 'T00:00:00.000Z',
      max: moment().add(10, 'days').toISOString()
    } as DatePickerOptions).then((date) => {
      date.value && (this.dateValue = moment(date.value).format('YYYY-MM-DD'))
    });
  }

  async registerNotify(): Promise<void> {
    localStorage.setItem(this.selectedCenter['center_id'], JSON.stringify({
      date: this.dateValue,
      district_id: this.districtValue,
      center_id: this.selectedCenter['center_id'],
      status: 1
    }));
    const toast = await this.toastController.create({
      message: 'You will be notified when slots are available',
      duration: 1000,
      position: 'middle'
    });
    toast.present();
  }

  private async showLoading(): Promise<any> {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
    return await this.loading.present();
  }

  private hideLoading(): void {
    this.loading.dismiss();
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
          this.search = {
            show: false,
            input: '',
            ageLimit: 'All',
            onlyAvailable: false,
            showSlots: false
          }
        });
      }
    });
  }
}