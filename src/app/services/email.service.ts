/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/*
 * Your main HTTP service for handling users, and related objects.
 */
@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private httpClient: HttpClient) { }

  // Creates QUERY arguments from the specified "args" argument given.
  getQueryArgs(args: any) {
    let result = '';
    for(const idx in args) {
      if (Object.prototype.hasOwnProperty.call(args, idx)) {
        const idxFilter = args[idx];
        if (idxFilter !== null && idxFilter !== undefined && idxFilter !== '') {
          if (result === '') {
            result += '?';
          } else {
            result += '&';
          }
          if (idx.endsWith('.like')) {
            result += idx + '=' + encodeURIComponent(idxFilter + '%');
          } else {
            result += idx + '=' + encodeURIComponent(idxFilter);
          }
        }
      }
    }
    return result;
  }

  countEmailTypes(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/email_types-count' + this.getQueryArgs(args));
  }

  deleteEmailType(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/emails/email_types' + this.getQueryArgs(args));
  }

  getEmailType(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/emails/email_types' + this.getQueryArgs(args));
  }

  createEmailType(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/emails/email_types', args);
  }

  updateEmailType(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/emails/email_types', args);
  }

  countEmails(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/emails/emails-count' + this.getQueryArgs(args));
  }

  deleteEmail(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/emails/emails' + this.getQueryArgs(args));
  }

  getEmail(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/emails/emails' + this.getQueryArgs(args));
  }

  createEmail(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/emails/emails', args);
  }

  updateEmail(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/emails/emails', args);
  }
}
