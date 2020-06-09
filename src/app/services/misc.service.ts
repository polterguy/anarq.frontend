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
export class MiscService {

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

  regions_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/misc/regions-count' + this.getQueryArgs(args));
  }

  regions_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/misc/regions' + this.getQueryArgs(args));
  }

  regions_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/misc/regions' + this.getQueryArgs(args));
  }

  regions_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/misc/regions', args);
  }

  regions_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/misc/regions', args);
  }

  votes_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/misc/votes-count' + this.getQueryArgs(args));
  }

  votes_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/misc/votes' + this.getQueryArgs(args));
  }

  votes_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/misc/votes' + this.getQueryArgs(args));
  }

  votes_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/misc/votes', args);
  }

  votes_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/misc/votes', args);
  }
}
