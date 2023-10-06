import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateUfficial'
})
export class DateUfficialPipe implements PipeTransform {

  transform(value: Date): string | null {
    if(value) return new Date(value).toLocaleDateString();
    return null;
  }

}
