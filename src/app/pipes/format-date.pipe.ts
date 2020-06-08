/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(value: any, args: string[]): any {
    const date = new Date(value);
    return date.toLocaleString();
  }
}
