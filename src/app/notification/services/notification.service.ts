import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private readonly httpClient: HttpClient) { }

  getStates(): Observable<any> {
    return this.httpClient.get('https://cdn-api.co-vin.in/api/v2/admin/location/states').pipe(
      map((data: any) => data.states)
    );
  }

  getDistricts(stateCode: string): Observable<any> {
    return this.httpClient.get('https://cdn-api.co-vin.in/api/v2/admin/location/districts/' + stateCode).pipe(
      map((data: any) => data.districts)
    );
  }

  getCenters(districtCode: string, date: string): Observable<any> {
    return this.httpClient.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict', {
      params: {
        district_id: districtCode,
        date: date
      }
    }).pipe(
      map((data: any) => data.centers)
    );
  }
}