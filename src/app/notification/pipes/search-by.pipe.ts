import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchBy' })
export class SearchByPipe implements PipeTransform {
  constructor() { }

  transform(centers: any, input: string, ageLimit: any, onlyAvailable: any): any {
    let filtered = centers || [];
    if (input) {
      filtered = filtered.filter((item: any) => {
        const filterString = `${item.name.toString().toLowerCase()}${item.pincode.toString().toLowerCase()}${item.fee_type.toString().toLowerCase()}`
        return filterString.includes(input.toLowerCase());
      });
    }
    if (ageLimit !== 'All') { //'All', '18 - 44', '45+'
      filtered = filtered.filter((item: any) => {
        return !!item.sessions.find((session: any) => ageLimit.includes(session.min_age_limit));
      })
    }
    if (onlyAvailable) {
      filtered = filtered.filter((item: any) => {
        return !!item.sessions.find((session: any) => session.available_capacity);
      })
    }

    return filtered;
  }
}
