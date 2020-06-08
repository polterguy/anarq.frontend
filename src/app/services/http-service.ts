/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/*
 * Your main HTTP service for invoking CRUD methods in your backend's API.
 *
 * Notice, also contains some "helper methods" such as authenticate, refresh JWT token, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  // Authenticates you towards your backend API.
  authenticate(username: string, password: string) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/system/auth/authenticate?username=' +
      encodeURI(username) +
      '&password=' +
      encodeURI(password));
  }

  // Will refresh an existing JWT token, if possible.
  refreshTicket() {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/system/auth/refresh-ticket');
  }

  // Will refresh an existing JWT token, if possible.
  changeMyPassword(password: string) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/system/auth/change-password', {
      password,
    });
  }
  
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

  // HTTP REST methods your backend exposes, and that was used to scaffold Angular frontend app.


  case_types_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/case_types-count' + this.getQueryArgs(args));
  }

  case_types_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/case_types' + this.getQueryArgs(args));
  }

  case_types_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/case_types' + this.getQueryArgs(args));
  }

  case_types_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/case_types', args);
  }

  case_types_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/case_types', args);
  }

  cases_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/cases-count' + this.getQueryArgs(args));
  }

  cases_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/cases' + this.getQueryArgs(args));
  }

  cases_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/cases' + this.getQueryArgs(args));
  }

  cases_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/cases', args);
  }

  cases_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/cases', args);
  }

  cases_Accept(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/cases-accept', args);
  }

  cases_Reject(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/cases-reject', args);
  }

  email_types_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/email_types-count' + this.getQueryArgs(args));
  }

  email_types_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/email_types' + this.getQueryArgs(args));
  }

  email_types_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/email_types' + this.getQueryArgs(args));
  }

  email_types_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/email_types', args);
  }

  email_types_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/email_types', args);
  }

  emails_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/emails-count' + this.getQueryArgs(args));
  }

  emails_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/emails' + this.getQueryArgs(args));
  }

  emails_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/emails' + this.getQueryArgs(args));
  }

  emails_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/emails', args);
  }

  emails_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/emails', args);
  }

  languages_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/languages-count' + this.getQueryArgs(args));
  }

  languages_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/languages' + this.getQueryArgs(args));
  }

  languages_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/languages' + this.getQueryArgs(args));
  }

  languages_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/languages', args);
  }

  languages_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/languages', args);
  }

  pgp_key_types_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/pgp_key_types-count' + this.getQueryArgs(args));
  }

  pgp_key_types_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/pgp_key_types' + this.getQueryArgs(args));
  }

  pgp_key_types_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/pgp_key_types' + this.getQueryArgs(args));
  }

  pgp_key_types_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/pgp_key_types', args);
  }

  pgp_key_types_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/pgp_key_types', args);
  }

  pgp_keys_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/pgp_keys-count' + this.getQueryArgs(args));
  }

  pgp_keys_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/pgp_keys' + this.getQueryArgs(args));
  }

  pgp_keys_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/pgp_keys' + this.getQueryArgs(args));
  }

  pgp_keys_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/pgp_keys', args);
  }

  pgp_keys_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/pgp_keys', args);
  }

  regions_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/regions-count' + this.getQueryArgs(args));
  }

  regions_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/regions' + this.getQueryArgs(args));
  }

  regions_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/regions' + this.getQueryArgs(args));
  }

  regions_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/regions', args);
  }

  regions_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/regions', args);
  }

  roles_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/roles-count' + this.getQueryArgs(args));
  }

  roles_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/roles' + this.getQueryArgs(args));
  }

  roles_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/roles' + this.getQueryArgs(args));
  }

  roles_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/roles', args);
  }

  roles_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/roles', args);
  }

  translations_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/translations-count' + this.getQueryArgs(args));
  }

  translations_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/translations' + this.getQueryArgs(args));
  }

  translations_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/translations' + this.getQueryArgs(args));
  }

  translations_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/translations', args);
  }

  translations_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/translations', args);
  }

  user_status_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/user_status-count' + this.getQueryArgs(args));
  }

  user_status_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/user_status' + this.getQueryArgs(args));
  }

  user_status_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/user_status' + this.getQueryArgs(args));
  }

  user_status_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/user_status', args);
  }

  user_status_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/user_status', args);
  }

  users_extra_types_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/users_extra_types-count' + this.getQueryArgs(args));
  }

  users_extra_types_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/users_extra_types' + this.getQueryArgs(args));
  }

  users_extra_types_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/users_extra_types' + this.getQueryArgs(args));
  }

  users_extra_types_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/users_extra_types', args);
  }

  users_extra_types_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/users_extra_types', args);
  }

  users_extra_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/users_extra-count' + this.getQueryArgs(args));
  }

  users_extra_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/users_extra' + this.getQueryArgs(args));
  }

  users_extra_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/users_extra' + this.getQueryArgs(args));
  }

  users_extra_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/users_extra', args);
  }

  users_extra_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/users_extra', args);
  }

  users_kyc_documents_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/users_kyc_documents-count' + this.getQueryArgs(args));
  }

  users_kyc_documents_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/users_kyc_documents' + this.getQueryArgs(args));
  }

  users_kyc_documents_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/users_kyc_documents' + this.getQueryArgs(args));
  }

  users_kyc_documents_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/users_kyc_documents', args);
  }

  users_kyc_documents_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/users_kyc_documents', args);
  }

  users_regions_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/users_regions-count' + this.getQueryArgs(args));
  }

  users_regions_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/users_regions' + this.getQueryArgs(args));
  }

  users_regions_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/users_regions' + this.getQueryArgs(args));
  }

  users_regions_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/users_regions', args);
  }

  users_roles_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/users_roles-count' + this.getQueryArgs(args));
  }

  users_roles_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/users_roles' + this.getQueryArgs(args));
  }

  users_roles_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/users_roles' + this.getQueryArgs(args));
  }

  users_roles_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/users_roles', args);
  }

  users_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/users-count' + this.getQueryArgs(args));
  }

  users_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/users' + this.getQueryArgs(args));
  }

  users_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/users' + this.getQueryArgs(args));
  }

  users_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/users', args);
  }

  users_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/users', args);
  }

  votes_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/votes-count' + this.getQueryArgs(args));
  }

  votes_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/anarchy/votes' + this.getQueryArgs(args));
  }

  votes_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/anarchy/votes' + this.getQueryArgs(args));
  }

  votes_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/votes', args);
  }

  votes_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/anarchy/votes', args);
  }
}
