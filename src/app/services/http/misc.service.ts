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
export class MiscService {

  constructor(private httpClient: HttpClient) { }

  countRegions(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/misc/regions-count' +
      getQueryArgs(args));
  }

  deleteRegion(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarchy/misc/regions' +
      getQueryArgs(args));
  }

  getRegions(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/misc/regions' +
      getQueryArgs(args));
  }

  createRegion(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/misc/regions',
      args);
  }

  updateRegion(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/misc/regions',
      args);
  }

  countVotes(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/misc/votes-count' +
      getQueryArgs(args));
  }

  deleteVote(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarchy/misc/votes' +
      getQueryArgs(args));
  }

  getVotes(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/misc/votes' +
      getQueryArgs(args));
  }

  createVote(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/misc/votes',
      args);
  }

  updateVote(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/misc/votes',
      args);
  }
}
