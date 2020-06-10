/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

 // System includes
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Custom includes
import { environment } from 'src/environments/environment';
import { getQueryArgs } from '../get-query-args';
import { CaseSlim } from 'src/app/models/case-slim';
import { AcceptCase } from 'src/app/models/accept-case';
import { CaseView } from 'src/app/models/case-view';
import { UserView } from 'src/app/models/user-view';

/*
 * Your main HTTP service for handling cases, and related objects.
 */
@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(private httpClient: HttpClient) { }

  /*
   * Authenticate endpoints, and helpers.
   */

  /**
   * Authenticates a user, returning a JWT ticket to caller.
   * 
   * @param username Username you are trying to authenticate
   * @param password Password for user
   */
  authenticate(username: string, password: string) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/system/auth/authenticate?username=' +
      encodeURI(username) +
      '&password=' +
      encodeURI(password));
  }

  /**
   * Will create a new JWT ticket with a new expiration date, by using
   * the existing JWT ticket for authenticating user.
   */
  refreshTicket() {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/system/auth/refresh-ticket');
  }

  /**
   * Changes the currect password for the currently authenticated user.
   * 
   * @param password New password for user
   */
  changeMyPassword(password: string) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/system/auth/change-password', {
      password,
    });
  }

  /**
   * Returns all open cases in system.
   * 
   * @param args Generic filter condition for which open cases to return
   */
  getOpenCases(fromId: number = null): Observable<CaseSlim[]> {
    let query = '';
    if (fromId) {
      query += '?id.lt=' + fromId;
    }
    return this.httpClient.get<CaseSlim[]>(
      environment.apiUrl +
      'magic/modules/anarchy/public/cases/open-cases' +
      query);
  }

  getUser(username: string) {
    return this.httpClient.get<UserView>(
      environment.apiUrl +
      'magic/modules/anarchy/public/users/user?username=' +
      username);
  }
}
