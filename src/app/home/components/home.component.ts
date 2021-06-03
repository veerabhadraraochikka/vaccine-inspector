import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit, ViewWillEnter {

  notified: any = [];

  constructor(protected readonly router: Router) {
    // if (router.routerState.snapshot.url.includes("business/hida")) {
    //   this.modifyStateOnAppChange("HIDA");
    // } else {
    //   this.modifyStateOnAppChange("RAVEN");
    // }
    // this.localNotifications.schedule({
    //   id: 1,
    //   title: 'Local Notification',
    //   text: 'Single Local Notification',
    //   data: { secret: 'secret' },
    //   lockscreen: true,
    //   foreground: true,
    //   color: 'rgb(0,128,0)'
    // });

    // private localNotifications: LocalNotifications
  }

  ionViewWillEnter(): void {
    this.getCenters();
  }


  ngOnInit(): void {

  }

  getCenters(): void {
    this.notified = [];
    Object.keys(localStorage).forEach((key) => {
      this.notified.push({
        center_id: key,
        ...JSON.parse(localStorage.getItem(key) || '{}')
      });
    });
  }

  deleteCenter(centerId: string): void {
    localStorage.removeItem(centerId);
    this.getCenters();
  }

  trackByFn(index: number, item: any) {
    return item.center_id;
  }

}
