/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a date and time to its date/time string using the current locale.
 */
@Pipe({
  name: 'date_format'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: any): any {
    const date = new Date(value);
    return date.toLocaleString();
  }
}
