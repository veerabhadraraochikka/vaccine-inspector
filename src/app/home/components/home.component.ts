import { Component, OnInit } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { LoadingController, ModalController, ToastController, ViewWillEnter } from '@ionic/angular';
import * as _moment from 'moment';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { NotificationService } from 'src/app/notification/services/notification.service';
import { SearchByPipe } from '../pipes/search-by.pipe';
import { NotifyModalComponent } from './notify-modal/notification-modal.component';

const moment = _moment;
@Component({
  selector: 'app-tab1',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit, ViewWillEnter {

  notified: any = [];
  centerIds: any = undefined;
  intervalTimer: any;
  latestCenterAvailability: any = [];
  search: any = {
    show: false,
    input: '',
    ageLimit: 'All',
    onlyAvailable: false
  }
  ageLimts: any = ['All', '18 - 44', '45+']
  interfaceOptions = { header: 'Age Limit' };
  intervalSettings: any = {
    active: false
  }
  intervalRunning: boolean = false;
  defaultInterval: any = { intervalDuration: 10, notifyTillDate: moment().add(5, 'days').format('YYYY-MM-DD') };
  loading: any;

  constructor(private localNotifications: LocalNotifications,
    private readonly notificationService: NotificationService,
    private readonly modalController: ModalController,
    private readonly toastController: ToastController,
    private readonly loadingController: LoadingController) {
  }

  ngOnInit(): void { }

  ionViewWillEnter(): void {
    this.onPageRender();
  }

  onPageRender(): void {
    const notify = JSON.parse(localStorage.getItem('NOTIFY') || JSON.stringify(this.defaultInterval));
    this.intervalSettings = {
      ...notify,
      active: this.isNotificationActive(notify.notifyTillDate)
    };
    const localKeys = Object.keys(localStorage).filter((key) => key !== 'NOTIFY');
    this.clearList();
    this.centerIds = [];
    if (localKeys.length) {
      this.centerIds = localKeys;
      this.initiateIntervals();
    }
  }

  getCenters(): void {
    this.centerIds.forEach((key: any) => {
      this.notified.push(JSON.parse(localStorage.getItem(key) || '{}'));
    });
    this.getLatestSlots();
  }

  deleteCenter(centerId: string): void {
    localStorage.removeItem(centerId.toString());
    this.centerIds = this.centerIds.filter((center: any) => center !== centerId.toString());
    this.latestCenterAvailability = this.latestCenterAvailability.filter((center: any) => center.center_id !== centerId);
    if (!this.latestCenterAvailability.length) {
      this.stopIntervals();
    }
  }

  trackByFn(index: number, item: any): any {
    return item.center_id;
  }

  async openNotificationSettings(): Promise<void> {
    const modal = await this.modalController.create({
      component: NotifyModalComponent,
      cssClass: 'notify-modal-component',
      swipeToClose: true
    });
    modal.present();
    modal.onWillDismiss().then((data) => {
      if (data.data) {
        if (data.data === 'S') {
          this.stopIntervals();
          return;
        }
        this.clearList();
        this.initiateIntervals();
      }
    })
  }

  private clearList(): void {
    this.notified = [];
    this.latestCenterAvailability = [];
  }

  private isNotificationActive(tillDate: any): boolean {
    return moment(moment().format('YYYY-MM-DD')).isSameOrBefore(tillDate);
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

  private async getLatestSlots(): Promise<void> {
    this.latestCenterAvailability = [];
    const groupCalls: any = [];
    const groupBy = this.groupByDistrict();
    await this.showLoading();
    for (let group in groupBy) {
      groupCalls.push(this.notificationService.getCenters(group, moment().format('DD-MM-YYYY')));
    }
    forkJoin(groupCalls).pipe(take(1)).subscribe((groups) => {
      groups.forEach((group: any = []) => {
        this.hideLoading();
        this.latestCenterAvailability = [
          ...this.latestCenterAvailability,
          ...group.filter((center: any) => this.centerIds.includes(center.center_id.toString()))
        ];
      });
      this.pushNotify();
    }, async () => {
      const toast = await this.toastController.create({
        message: 'Unable to fetch latest availability',
        duration: 500,
        position: 'middle'
      });
      toast.present();
      this.hideLoading();
    });
    if (!this.centerIds.length) {
      this.stopIntervals();
    }
  }

  private groupByDistrict(): any {
    return this.notified.reduce((carry: any, item: any) => {
      (carry[item['district_id']] = carry[item['district_id']] || []).push(item);
      return carry;
    }, {});
  }

  private initiateIntervals(): void {
    this.getCenters();
    this.stopIntervals();
    if (this.intervalSettings.active) {
      this.resumeIntervals();
    }
  }

  resumeIntervals(): void {
    this.intervalRunning = true;
    this.intervalTimer = setInterval(() => {
      this.clearList();
      this.getCenters()
    }, this.intervalSettings.intervalDuration * (1000 * 60));
  }

  stopIntervals() {
    this.intervalRunning = false;
    this.intervalTimer && clearInterval(this.intervalTimer);
  }

  pushNotify(): void {
    const avail = new SearchByPipe().transform(this.latestCenterAvailability, '', 'All', true);
    avail.forEach((item: any) => {
      this.showNotification(item);
    });
  }

  private showNotification(center: any): void {
    const count = center.sessions.reduce((pr: number, session: any) => pr + session.available_capacity, 0);
    if (count) {
      this.localNotifications.schedule({
        id: center.center_id + count,
        title: 'Vaccine Available@' + center.name,
        text: `Count - ${count} | Address: ${center.address}`,
        lockscreen: true,
        foreground: true,
        color: 'rgb(0,128,0)'
      });
    }
  }
}
