/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fromDate'
})
export class FromDatePipe implements PipeTransform {

  transform(value: any, args: string[]): any {
    const when = new Date(value).getTime();
    const now = new Date().getTime();
    const deltaSeconds = Math.round((now - when) / 1000);
    if (deltaSeconds < 180) {
      return `${deltaSeconds} seconds ago`;
    }
    const deltaMinutes = Math.round(deltaSeconds / 60);
    if (deltaMinutes < 60) {
      return `${deltaMinutes} minutes ago`;
    }
    const deltaHours = Math.round(deltaMinutes / 60);
    if (deltaHours < 24) {
      return `${deltaHours} hours ago`;
    }
    const deltaDays = Math.round(deltaHours / 24);
    if (deltaDays < 60) {
      return `${deltaDays} days ago`;
    }
    const deltaWeeks = Math.round(deltaDays / 7);
    if (deltaWeeks < 20) {
      return `${deltaWeeks} weeks ago`;
    }
    const deltaMontsh = Math.round(deltaWeeks / 4.2);
    return `${deltaMontsh} months ago`;
  }
}
