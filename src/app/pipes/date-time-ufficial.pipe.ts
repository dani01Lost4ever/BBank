import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTimeUfficial'
})
export class DateTimeUfficialPipe implements PipeTransform {

  public transform(value: Date): string | null {
    let v;
    if(value) {
      const v1 = new Date(value).toLocaleDateString()
      const v2 = new Date(value).toLocaleTimeString()
      return v1 + " " + v2
    }
    return null;
  }

}
