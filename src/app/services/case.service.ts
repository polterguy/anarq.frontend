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

  countCaseTypes(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/case_types-count' + this.getQueryArgs(args));
  }

  deleteCaseType(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/case_types' + this.getQueryArgs(args));
  }

  getCaseTypes(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/case_types' + this.getQueryArgs(args));
  }

  createCaseType(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/case_types', args);
  }

  updateCaseType(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/case_types', args);
  }

  countCases(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases-count' + this.getQueryArgs(args));
  }

  deleteCases(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases' + this.getQueryArgs(args));
  }

  getCases(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases' + this.getQueryArgs(args));
  }

  getOpenCases(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/open-cases' + this.getQueryArgs(args));
  }

  createCase(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases', args);
  }

  updateCase(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases', args);
  }

  acceptCase(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases-accept', args);
  }

  rejectCase(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/cases/cases-reject', args);
  }
}
