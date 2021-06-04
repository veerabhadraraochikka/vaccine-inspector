import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchBy' })
export class SearchByPipe implements PipeTransform {
  constructor() { }

  transform(centers: any, input: string, ageLimit: any, onlyAvailable: any): any {
    let filtered = centers || [];
    filtered = filtered.filter((item: any) => {
      let flag = true;
      if (input) {
        const filterString = `${item.name.toString().toLowerCase()}${item.pincode.toString().toLowerCase()}${item.fee_type.toString().toLowerCase()}`
        flag = flag && filterString.includes(input.toLowerCase());
      }
      if (ageLimit !== 'All' || onlyAvailable) {
        flag = flag && !!item.sessions.find((session: any) => {
          let flag1 = true
          if (ageLimit !== 'All') {
            flag1 = flag1 && ageLimit.includes(session.min_age_limit)
          }
          if (onlyAvailable) {
            flag1 = flag1 && !!session.available_capacity;
          }
          return flag1
        });
      }
      return flag;
    });

    return filtered;
  }
}
