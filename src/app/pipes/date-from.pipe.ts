/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Pipe, PipeTransform } from '@angular/core';
import { BaseComponent } from '../helpers/base.component';

 /**
  * Calculates a time in the past, and returns a friendly string
  * telling the user how many seconds/minutes/hours/days/etc it
  * was ago.
  */
@Pipe({
  name: 'fromDate'
})
export class DateFromPipe implements PipeTransform {

  transform(value: any): any {
    const when = new Date(value).getTime();
    const now = new Date().getTime();
    const deltaSeconds = Math.round((now - when) / 1000);
    if (deltaSeconds < 180) {
      return `${deltaSeconds} ${BaseComponent.translate('seconds')} ${BaseComponent.translate('ago')}`;
    }
    const deltaMinutes = Math.round(deltaSeconds / 60);
    if (deltaMinutes < 60) {
      return `${deltaMinutes} ${BaseComponent.translate('minutes')} ${BaseComponent.translate('ago')}`;
    }
    const deltaHours = Math.round(deltaMinutes / 60);
    if (deltaHours < 24) {
      return `${deltaHours} ${BaseComponent.translate('hours')} ${BaseComponent.translate('ago')}`;
    }
    const deltaDays = Math.round(deltaHours / 24);
    if (deltaDays < 60) {
      return `${deltaDays} ${BaseComponent.translate('days')} ${BaseComponent.translate('ago')}`;
    }
    const deltaWeeks = Math.round(deltaDays / 7);
    if (deltaWeeks < 20) {
      return `${deltaWeeks} ${BaseComponent.translate('weeks')} ${BaseComponent.translate('ago')}`;
    }
    const deltaMontsh = Math.round(deltaWeeks / 4.2);
    return `${deltaMontsh} ${BaseComponent.translate('months')} ${BaseComponent.translate('ago')}`;
  }
}
