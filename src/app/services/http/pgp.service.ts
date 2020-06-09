/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { getQueryArgs } from '../get-query-args';

/*
 * Your main HTTP service for handling users, and related objects.
 */
@Injectable({
  providedIn: 'root'
})
export class PgpService {

  constructor(private httpClient: HttpClient) { }

  /*
   * Key types CRUD endpoints.
   */

  countKeyTypes(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_key_types-count' +
      getQueryArgs(args));
  }

  deleteKeyType(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_key_types' +
      getQueryArgs(args));
  }

  getKeyType(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_key_types' +
      getQueryArgs(args));
  }

  createKeyType(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_key_types',
      args);
  }

  updateKeyType(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_key_types',
      args);
  }

  /*
   * Keys CRUD endpoints.
   */

  countKeys(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_keys-count' +
      getQueryArgs(args));
  }

  deleteKey(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_keys' +
      getQueryArgs(args));
  }

  getKeys(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_keys' +
      getQueryArgs(args));
  }

  createKey(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_keys',
      args);
  }

  updateKey(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/pgp/pgp_keys',
      args);
  }
}
