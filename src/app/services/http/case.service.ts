/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { getQueryArgs } from '../get-query-args';

/*
 * Your main HTTP service for handling cases, and related objects.
 */
@Injectable({
  providedIn: 'root'
})
export class CaseService {

  constructor(private httpClient: HttpClient) { }

  /*
   * Case types CRUD operations.
   */

  countCaseTypes(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/cases/case_types-count' +
      getQueryArgs(args));
  }

  deleteCaseType(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarchy/cases/case_types' +
      getQueryArgs(args));
  }

  getCaseTypes(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/cases/case_types' +
      getQueryArgs(args));
  }

  createCaseType(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/cases/case_types',
      args);
  }

  updateCaseType(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/cases/case_types',
      args);
  }

  /*
   * Cases CRUD operations.
   */

  countCases(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/cases/cases-count' +
      getQueryArgs(args));
  }

  deleteCases(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarchy/cases/cases' +
      getQueryArgs(args));
  }

  getCases(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/cases/cases' +
      getQueryArgs(args));
  }

  createCase(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/cases/cases',
      args);
  }

  updateCase(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/cases/cases',
      args);
  }

  /*
   * Specialized case endpoints, for accepting and rejecting a case, etc.
   */

  /**
   * Returns all open cases in system.
   * 
   * @param args Generic filter condition for which open cases to return
   */
  getOpenCases(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/cases/open-cases' +
      getQueryArgs(args));
  }

  /**
   * Accepts the specified case.
   * 
   * @param args Generic filter argument
   */
  acceptCase(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/cases/cases-accept',
      args);
  }

  /**
   * Rejects the specified case.
   * 
   * @param args Generic filter argument
   */
  rejectCase(id: number) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/cases/cases-reject', {
        id
      });
  }
}