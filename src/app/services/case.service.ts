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
export class CaseService {

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

  case_types_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/case_types-count' + this.getQueryArgs(args));
  }

  case_types_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/case_types' + this.getQueryArgs(args));
  }

  case_types_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/case_types' + this.getQueryArgs(args));
  }

  case_types_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/case_types', args);
  }

  case_types_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/case_types', args);
  }

  cases_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases-count' + this.getQueryArgs(args));
  }

  cases_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases' + this.getQueryArgs(args));
  }

  cases_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases' + this.getQueryArgs(args));
  }

  cases_GetOpen(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/open-cases' + this.getQueryArgs(args));
  }

  cases_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases', args);
  }

  cases_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases', args);
  }

  cases_Accept(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases-accept', args);
  }

  cases_Reject(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases-reject', args);
  }
}
