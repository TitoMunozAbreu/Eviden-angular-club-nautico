import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalLetter'
})
export class CapitalLetterPipe implements PipeTransform {

  transform(name: string, ...args: unknown[]): unknown {
    let capitalLeter = name.charAt(0).toUpperCase() + name.slice(1,name.length)
    return capitalLeter
  }

}
