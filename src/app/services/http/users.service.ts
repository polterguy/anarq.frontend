/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
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

  /**
   * Returns users according to the given filter condition.
   * 
   * @param filter Filtering criteria for what users to return
   */
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
      'magic/modules/anarq/private/users/users' +
      query);
  }

  /**
   * Counts the numbers of users matching the specified filter condition.
   * 
   * @param filter Like condition for users to count
   */
  getUsersCount(filter: string = null) {
    let query = '';
    if (filter !== null) {
      query += '?username.like=' + encodeURIComponent(filter + '%');
    }
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users-count' +
      query);
  }

  /**
   * Returns all roles matching the specified filtering condition.
   * 
   * @param filter Filtering conditions for what roles to return
   */
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
      'magic/modules/anarq/private/users/roles' + query);
  }

  /**
   * Returns all roles matching the specified filtering condition.
   * 
   * @param filter Like condition for roles to count
   */
  getRolesCount(filter: string = null) {
    let query = '';
    if (filter !== null) {
      query += '?name.like=' + encodeURIComponent(filter + '%');
    }
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/roles-count' + query);
  }

  /**
   * Creates a new user in the system.
   * 
   * @param username Username of new user
   * @param password Password for new user
   */
  createUser(username: string, password: string) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users', {
      username,
      password,
    });
  }

  /**
   * Creates a new role in the system.
   * 
   * @param name Name of role to create
   * @param description Description of role to create
   */
  createRole(name: string, description?: string) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/roles', {
      name,
      description,
    });
  }

  /**
   * Deletes a specific user in the system.
   * 
   * @param username Username of user to delete
   */
  deleteUser(username: string) {
    return this.httpClient.delete<any>(
      environment.apiUrl + 
      'magic/modules/anarq/private/users/users?username=' +
      encodeURIComponent(username));
  }

  /**
   * Deletes a specific role in the system.
   * 
   * @param name Name of role to delete
   */
  deleteRole(name: string) {
    return this.httpClient.delete<any>(
      environment.apiUrl + 
      'magic/modules/anarq/private/users/roles?name=' +
      encodeURIComponent(name));
  }

  /**
   * Returns all roles that the specified user belongs to.
   * 
   * @param username Username of user to return roles for
   */
  getUserRoles(username: string) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_roles?user.eq=' +
      encodeURIComponent(username));
  }

  /**
   * Associates the specified user with a new role.
   * 
   * @param user Username of user to add role to
   * @param role Name of new role to associate user with
   */
  addRoleToUser(user: string, role: string) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_roles', {
      user,
      role,
    });
  }

  /**
   * Deletes a role association for a specified user.
   * 
   * @param user Username of user to delete role from
   * @param role Role to delete from user
   */
  deleteRoleFromUser(user: string, role: string) {
    return this.httpClient.delete<any>(
      environment.apiUrl + 
      'magic/modules/anarq/private/users/users_roles?role=' +
      encodeURIComponent(role) +
      '&user=' + encodeURIComponent(user));
  }

  /*
   * User status CRUD endpoints.
   */

  countUserStatus(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/user_status-count' +
      getQueryArgs(args));
  }

  deleteUserStatus(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/user_status' +
      getQueryArgs(args));
  }

  getUserStatus(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/user_status' +
      getQueryArgs(args));
  }

  createUserStatus(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/user_status',
      args);
  }

  updateUserStatus(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/user_status',
      args);
  }

  /*
   * User regions CRUD endpoints.
   */

  countUsersRegions(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_regions-count' +
      getQueryArgs(args));
  }

  deleteUsersRegions(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_regions' +
      getQueryArgs(args));
  }

  getUsersRegions(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_regions' +
      getQueryArgs(args));
  }

  createUsersRegions(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_regions',
      args);
  }

  updateUsersRegions(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_regions',
      args);
  }

  /*
   * Extra types CRUD endpoints.
   */

  countExtraTypes(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_extra_types-count' +
      getQueryArgs(args));
  }

  deleteExtraType(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_extra_types' +
      getQueryArgs(args));
  }

  getExtraTypes(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_extra_types' +
      getQueryArgs(args));
  }

  createExtraType(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_extra_types',
      args);
  }

  updateExtraType(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_extra_types',
      args);
  }

  /*
   * User extra CRUD endpoints.
   */

  countUserExtras(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_extra-count' +
      getQueryArgs(args));
  }

  deleteUserExtra(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_extra' +
      getQueryArgs(args));
  }

  getUserExtra(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_extra' +
      getQueryArgs(args));
  }

  createUserExtra(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_extra',
      args);
  }

  updateUserExtra(args: any) {
    return this.httpClient.put<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_extra',
      args);
  }

  /*
   * Regions CRUD endpoints.
   */

  countUserRegions(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_regions-count' +
      getQueryArgs(args));
  }

  deleteUserRegion(args: any) {
    return this.httpClient.delete<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_regions' +
      getQueryArgs(args));
  }

  getUserRegions(args: any) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_regions' +
      getQueryArgs(args));
  }

  createUserRegion(args: any) {
    return this.httpClient.post<any>(
      environment.apiUrl +
      'magic/modules/anarq/private/users/users_regions',
      args);
  }
}
