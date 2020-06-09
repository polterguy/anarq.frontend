/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { getQueryArgs } from '../get-query-args';

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
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/system/auth/refresh-ticket');
  }

  // Will refresh an existing JWT token, if possible.
  changeMyPassword(password: string) {
    return this.httpClient.put<any>(
      environment.apiUrl +
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
      'magic/modules/anarchy/users/users' +
      query);
  }

  // Returns count of users according to the specified filter condition.
  getUsersCount(filter: string = null) {
    let query = '';
    if (filter !== null) {
      query += '?username.like=' + encodeURIComponent(filter + '%');
    }
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users-count' +
      query);
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
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users', {
      username,
      password,
    });
  }

  // Creates a new role.
  createRole(name: string, description?: string) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/roles', {
      name,
      description,
    });
  }

  // Deletes an existing user.
  deleteUser(username: string) {
    return this.httpClient.delete<any>(
      environment.apiUrl + 
      'magic/modules/anarchy/users/users?username=' +
      encodeURIComponent(username));
  }

  // Deletes an existing role.
  deleteRole(name: string) {
    return this.httpClient.delete<any>(
      environment.apiUrl + 
      'magic/modules/anarchy/users/roles?name=' +
      encodeURIComponent(name));
  }

  // Returns all roles that the specified user belongs to.
  getUserRoles(username: string) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_roles?user.eq=' +
      encodeURIComponent(username));
  }

  // Adds a specified user to a specified role.
  addRoleToUser(user: string, role: string) {
    return this.httpClient.post<any>(
      environment.apiUrl +
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

  countUserStatus(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/user_status-count' +
      getQueryArgs(args));
  }

  deleteUserStatus(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/user_status' +
      getQueryArgs(args));
  }

  getUserStatus(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/user_status' +
      getQueryArgs(args));
  }

  createUserStatus(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/user_status',
      args);
  }

  updateUserStatus(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/user_status',
      args);
  }

  countExtraTypes(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_extra_types-count' +
      getQueryArgs(args));
  }

  deleteExtraType(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_extra_types' +
      getQueryArgs(args));
  }

  getExtraTypes(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_extra_types' +
      getQueryArgs(args));
  }

  createExtraType(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_extra_types',
      args);
  }

  updateExtraType(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_extra_types',
      args);
  }

  countUserExtras(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_extra-count' +
      getQueryArgs(args));
  }

  deleteUserExtra(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_extra' +
      getQueryArgs(args));
  }

  getUserExtra(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_extra' +
      getQueryArgs(args));
  }

  createUserExtra(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_extra',
      args);
  }

  updateUserExtra(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_extra',
      args);
  }

  countUserKycDocuments(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_kyc_documents-count' +
      getQueryArgs(args));
  }

  deleteUserKycDocument(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_kyc_documents' +
      getQueryArgs(args));
  }

  getUserKycDocuments(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_kyc_documents' +
      getQueryArgs(args));
  }

  createUserKycDocument(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_kyc_documents',
      args);
  }

  updateUserKycDocument(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_kyc_documents',
      args);
  }

  countUserRegions(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_regions-count' +
      getQueryArgs(args));
  }

  deleteUserRegion(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_regions' +
      getQueryArgs(args));
  }

  getUserRegions(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_regions' +
      getQueryArgs(args));
  }

  createUserRegion(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarchy/users/users_regions',
      args);
  }
}
