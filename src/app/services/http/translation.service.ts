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
export class TranslationService {

  constructor(private httpClient: HttpClient) { }

  /*
   * Languages CRUD endpoints.
   */

  countLanguages(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/private/translations/languages-count' +
      getQueryArgs(args));
  }

  deleteLanguage(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarchy/private/translations/languages' +
      getQueryArgs(args));
  }

  getLanguages(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/private/translations/languages' +
      getQueryArgs(args));
  }

  createLanguage(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/private/translations/languages',
      args);
  }

  updateLanguage(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/private/translations/languages',
      args);
  }

  /*
   * Translations CRUD endpoints.
   */

  countTranslations(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/private/translations/translations-count' +
      getQueryArgs(args));
  }

  deleteTranslation(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarchy/private/translations/translations' +
      getQueryArgs(args));
  }

  getTranslation(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/private/translations/translations' +
      getQueryArgs(args));
  }

  createTranslation(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/private/translations/translations',
      args);
  }

  updateTranslation(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/private/translations/translations',
      args);
  }
}
