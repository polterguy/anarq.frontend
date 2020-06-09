/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date_format_short'
})
export class DateFormatShortPipe implements PipeTransform {
  transform(value: any, args: string[]): any {
    const date = new Date(value);
    return date.toDateString();
  }
}
