import { Component, OnInit } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ToastController, ViewWillEnter } from '@ionic/angular';
import * as _moment from 'moment';
import { forkJoin, interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { NotificationService } from 'src/app/notification/services/notification.service';

const moment = _moment;
@Component({
  selector: 'app-tab1',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit, ViewWillEnter {

  notified: any = [];
  centerIds: any = undefined;
  intervals: any;
  latestCenterAvailability: any = [];
  search: any = {
    show: false,
    input: '',
    ageLimit: 'All',
    onlyAvailable: false
  }
  ageLimts: any = ['All', '18 - 44', '45+']
  interfaceOptions = { header: 'Age Limit' };

  constructor(private localNotifications: LocalNotifications,
    private readonly notificationService: NotificationService,
    private readonly toastController: ToastController) {
  }

  ionViewWillEnter(): void {
    const localKeys = Object.keys(localStorage);
    if (!localKeys.length) {
      this.centerIds = [];
      this.latestCenterAvailability = [];
      return;
    }
    if (this.centerIds === undefined || this.centerIds.toString() !== localKeys.toString()) {
      this.centerIds = localKeys;
      this.getCenters();
    }
  }


  ngOnInit(): void { }

  getCenters(): void {
    this.notified = [];
    this.centerIds.forEach((key: any) => {
      const center = JSON.parse(localStorage.getItem(key) || '{}');
      if (this.isValidCenter(center)) {
        this.notified.push({
          center_id: key,
          ...center
        });
      } else {
        this.deleteCenter(key);
      }
    });
    this.getLatestSlots();
  }

  deleteCenter(centerId: string): void {
    localStorage.removeItem(centerId);
    this.centerIds = this.centerIds.filter((center: any) => center !== centerId);
    this.latestCenterAvailability = this.latestCenterAvailability.filter((center: any) => center.center_id !== centerId);
  }

  trackByFn(index: number, item: any) {
    return item.center_id;
  }

  private isValidCenter(center: any): boolean {
    return moment(moment()).isSameOrBefore(center.notifyTillDate);
  }

  private getLatestSlots(): void {
    this.latestCenterAvailability = [];
    const groupCalls: any = [];
    const groupBy = this.groupByDistrict();
    for (let group in groupBy) {
      groupCalls.push(this.notificationService.getCenters(group, moment().format('DD-MM-YYYY')));
    }
    forkJoin(groupCalls).pipe(take(1)).subscribe((groups) => {
      groups.forEach((group: any = []) => {
        this.latestCenterAvailability = [
          ...this.latestCenterAvailability,
          ...group.filter((center: any) => this.centerIds.includes(center.center_id.toString()))
        ]
      });
      this.setIntervals();
    }, async () => {
      const toast = await this.toastController.create({
        message: 'Unable to fetch latest availability',
        duration: 500,
        position: 'top'
      });
      toast.present();
    })
  }

  private groupByDistrict(): any {
    return this.notified.reduce((carry: any, item: any) => {
      (carry[item['district_id']] = carry[item['district_id']] || []).push(item);
      return carry;
    }, {});
  }

  private setIntervals(): void {

  }

  private showNotification(center: any): void {
    const count = center.sessions.reduce((pr: number, session: any) => pr + session.available_capacity, 0);
    if (count) {
      this.localNotifications.schedule({
        id: center.center_id,
        title: 'Vaccine Available@' + center.name,
        text: `Count - ${count} | Address: ${center.address}`,
        lockscreen: true,
        foreground: true,
        color: 'rgb(0,128,0)'
      });
    }
  }
}
