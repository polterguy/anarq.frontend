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
export class TranslationService {

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

  languages_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/translations/languages-count' + this.getQueryArgs(args));
  }

  languages_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/translations/languages' + this.getQueryArgs(args));
  }

  languages_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/translations/languages' + this.getQueryArgs(args));
  }

  languages_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/translations/languages', args);
  }

  languages_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/translations/languages', args);
  }

  translations_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/translations/translations-count' + this.getQueryArgs(args));
  }

  translations_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/translations/translations' + this.getQueryArgs(args));
  }

  translations_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/translations/translations' + this.getQueryArgs(args));
  }

  translations_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/translations/translations', args);
  }

  translations_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/translations/translations', args);
  }
}
