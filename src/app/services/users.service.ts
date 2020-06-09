/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/*
 * Filter for invoking "auth" methods, allowing you to filter users/roles/etc.
 */
export class AuthFilter {
  filter?: string;
  offset: number;
  limit: number;
}

/*
 * Authentication and authorization service, allowing you to query your backend
 * for its users/roles/etc.
 */
@Injectable({
  providedIn: 'root'
})
export class UsersService {

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
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/system/auth/refresh-ticket');
  }

  // Will refresh an existing JWT token, if possible.
  changeMyPassword(password: string) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/system/auth/change-password', {
      password,
    });
  }

  // Returns all users according to the specified filter condition.
  getUsers(filter: AuthFilter = null) {
    let query = '';
    if (filter !== null) {
      query += '?limit=' + filter.limit;
      query += "&offset=" + filter.offset;
      if (filter.filter !== null && filter.filter !== undefined && filter.filter != '') {
        query += '&username.like=' + encodeURIComponent(filter.filter + '%');
      }
    }
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users' + query);
  }

  // Returns count of users according to the specified filter condition.
  getUsersCount(filter: string = null) {
    let query = '';
    if (filter !== null) {
      query += '?username.like=' + encodeURIComponent(filter + '%');
    }
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users-count' + query);
  }

  // Returns all roles according to the specified filter condition.
  getRoles(filter: AuthFilter = null) {
    let query = '';
    if (filter !== null) {
      query += '?limit=' + filter.limit;
      query += "&offset=" + filter.offset;
      if (filter.filter !== null && filter.filter !== undefined && filter.filter != '') {
        query += '&name.like=' + encodeURIComponent(filter.filter + '%');
      }
    }
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/roles' + query);
  }

  // Returns count of roles according to the specified filter condition.
  getRolesCount(filter: string = null) {
    let query = '';
    if (filter !== null) {
      query += '?name.like=' + encodeURIComponent(filter + '%');
    }
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/roles-count' + query);
  }

  // Creates a new user.
  createUser(username: string, password: string) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/users', {
      username,
      password,
    });
  }

  // Creates a new role.
  createRole(name: string, description?: string) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/anarchy/roles', {
      name,
      description,
    });
  }

  // Deletes an existing user.
  deleteUser(username: string) {
    return this.httpClient.delete<any>(
      environment.apiUrl + 
      'magic/modules/anarchy/users/users?username=' + encodeURIComponent(username));
  }

  // Deletes an existing role.
  deleteRole(name: string) {
    return this.httpClient.delete<any>(
      environment.apiUrl + 
      'magic/modules/anarchy/users/roles?name=' + encodeURIComponent(name));
  }

  // Returns all roles that the specified user belongs to.
  getUserRoles(username: string) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_roles?user.eq=' + encodeURIComponent(username));
  }

  // Adds a specified user to a specified role.
  addRoleToUser(user: string, role: string) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_roles', {
      user,
      role,
    });
  }

  // Removes a role fomr a user.
  deleteRoleFromUser(user: string, role: string) {
    return this.httpClient.delete<any>(
      environment.apiUrl + 
      'magic/modules/anarchy/users/users_roles?role=' +
      encodeURIComponent(role) +
      '&user=' + encodeURIComponent(user));
  }

  user_status_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/users/user_status-count' + this.getQueryArgs(args));
  }

  user_status_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/users/user_status' + this.getQueryArgs(args));
  }

  user_status_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/users/user_status' + this.getQueryArgs(args));
  }

  user_status_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/users/user_status', args);
  }

  user_status_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/users/user_status', args);
  }

  users_extra_types_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_extra_types-count' + this.getQueryArgs(args));
  }

  users_extra_types_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_extra_types' + this.getQueryArgs(args));
  }

  users_extra_types_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_extra_types' + this.getQueryArgs(args));
  }

  users_extra_types_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_extra_types', args);
  }

  users_extra_types_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_extra_types', args);
  }

  users_extra_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_extra-count' + this.getQueryArgs(args));
  }

  users_extra_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_extra' + this.getQueryArgs(args));
  }

  users_extra_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_extra' + this.getQueryArgs(args));
  }

  users_extra_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_extra', args);
  }

  users_extra_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_extra', args);
  }

  users_kyc_documents_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_kyc_documents-count' + this.getQueryArgs(args));
  }

  users_kyc_documents_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_kyc_documents' + this.getQueryArgs(args));
  }

  users_kyc_documents_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_kyc_documents' + this.getQueryArgs(args));
  }

  users_kyc_documents_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_kyc_documents', args);
  }

  users_kyc_documents_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_kyc_documents', args);
  }

  users_regions_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_regions-count' + this.getQueryArgs(args));
  }

  users_regions_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_regions' + this.getQueryArgs(args));
  }

  users_regions_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_regions' + this.getQueryArgs(args));
  }

  users_regions_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl +
      'magic/modules/anarchy/users/users_regions', args);
  }
}
