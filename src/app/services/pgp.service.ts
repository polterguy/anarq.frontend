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
export class PgpService {

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

  countKeyTypes(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_key_types-count' + this.getQueryArgs(args));
  }

  deleteKeyType(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_key_types' + this.getQueryArgs(args));
  }

  getKeyType(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_key_types' + this.getQueryArgs(args));
  }

  createKeyType(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_key_types', args);
  }

  updateKeyType(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_key_types', args);
  }

  countKeys(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_keys-count' + this.getQueryArgs(args));
  }

  deleteKey(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_keys' + this.getQueryArgs(args));
  }

  getKeys(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_keys' + this.getQueryArgs(args));
  }

  createKey(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_keys', args);
  }

  updateKey(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_keys', args);
  }
}
