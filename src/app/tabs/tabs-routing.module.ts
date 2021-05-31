import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'vaccine',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'notification',
        loadChildren: () => import('../notification/notification.module').then(m => m.NotificationModule)
      },
      {
        path: 'booking',
        loadChildren: () => import('../booking/booking.module').then(m => m.BookingModule)
      },
      {
        path: '',
        redirectTo: '/vaccine/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/vaccine/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
