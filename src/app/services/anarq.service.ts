import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Main service for AnarQ allowing you to invoke AnarQ backend.
 */
@Injectable({
  providedIn: 'root'
})
export class AnarqService {

  /**
   * Creates an instance of your service
   * 
   * @param httpClient Dependency injected HTTP client
   */
  constructor(private httpClient: HttpClient) { }

  /**
   * Allows you to administrate and retrieve pages from your backend.
   */
  get pages() {
    return {

      /**
       * Retrieves a single page from your backend.
       * 
       * @param url What page to return
       * @returns A single page object
       */
      get: (url: string) => {
        return this.httpClient.get(
          environment.apiUrl + 'magic/modules/anarq/site/page?url=' +
          encodeURIComponent(url));
      },

      /**
       * Retrieves all pages from your backend.
       * 
       * @returns All pages in your database
       */
      list: () => {
        return this.httpClient.get(
          environment.apiUrl + 'magic/modules/anarq/site/pages');
      },

      /**
       * Creates a new page in your backend.
       * 
       * @param url URL of new page
       * @param name Name or title for your new page
       * @param content Markdown content for your new page
       * @returns Whether or not creation was successful
       */
      create: (url: string, name: string, content: string) => {
        return this.httpClient.post(
          environment.apiUrl + 'magic/modules/anarq/site/page', {
            url,
            name,
            content,
        });
      },

      /**
       * Creates a new page in your backend.
       * 
       * @param url URL of page to update
       * @param name New name or title for your page
       * @param content New Markdown content for your page
       * @returns Whether or not creation was successful
       */
       update: (url: string, name: string, content: string) => {
        return this.httpClient.put(
          environment.apiUrl + 'magic/modules/anarq/site/page', {
            url,
            name,
            content,
        });
      },

      /**
       * Deletes a specific page in your backend.
       * 
       * @param url URL of page to delete
       * @returns Whether or not invocation was successful or not
       */
      delete: (url: string) => {
        return this.httpClient.delete(
          environment.apiUrl + 'magic/modules/anarq/site/page?url=' +
          encodeURIComponent(url));
      }
    };
  }

  /**
   * Gives you access to profiles, authenticating users, registering new users, etc.
   */
  get profile() {
    return {

      /**
       * Authenticates a user returning an authorisation token back to caller.
       * 
       * @param username Username
       * @param password Password
       * @returns An authorisation token needed to authorise user in consecutive requests
       */
      authenticate: (username: string, password: string) => {
        return this.httpClient.get(
          environment.apiUrl + 'magic/modules/anarq/profile/authenticate?username=' +
          encodeURIComponent(username) + '&password=' + encodeURIComponent(password));
      },

      /**
       * Allows a user to confirms his or her email address.
       * 
       * @param email Email address of user
       * @param secret Secret sent to user's email address
       * @returns Whether or not confirmation was successful or not
       */
      confirmEmail: (email: string, secret: string) => {
        return this.httpClient.post(
          environment.apiUrl + 'magic/modules/anarq/profile/confirm-email', {
            email,
            secret,
          }
        );
      },

      /**
       * Checks if an email address is available or not.
       * 
       * @param email Email address to check
       * @returns Success if email address is available
       */
      emailAvailable: (email: string) => {
        return this.httpClient.get(
          environment.apiUrl + 'magic/modules/anarq/profile/email-available' +
          encodeURIComponent(email));
      },

      /**
       * Checks if an username is available or not.
       * 
       * @param username Username to check
       * @returns Success if email address is available
       */
       usernameAvailable: (username: string) => {
        return this.httpClient.get(
          environment.apiUrl + 'magic/modules/anarq/profile/username-available' +
          encodeURIComponent(username));
      },

      /**
       * Returns profile information for the currently authenticated user.
       * 
       * @returns Information for the currently authenticated user
       */
      me: () => {
        return this.httpClient.get(
          environment.apiUrl + 'magic/modules/anarq/profile/me');
      },

      /**
       * Registers a new user on site.
       * 
       * @param username Chosen username
       * @param password Chosen password
       * @param email Email of user
       * @param fullName Full name of user
       * @returns Whether or not operation was successful or not
       */
      register: (username: string, password: string, email: string, fullName: string) => {
        return this.httpClient.post(
          environment.apiUrl + 'magic/modules/anarq/profile/register', {
            username,
            password,
            email,
            full_name: fullName,
            email_type: 'web'
        });
      },
    }
  }

  /**
   * The admin interface to the backend, allowing moderators to moderate posts and comments, 
   * retrieve detailed information about users, etc.
   */
  get admin() {
    return {

      /**
       * Hard deletes a comment, and all of its descendants too.
       * Notice, you probably want to use moderateComment instead.
       * 
       * @param id Comment to delete
       * @returns Whether or not operation was success or not
       */
      deleteComment: (id: number) => {
        return this.httpClient.delete(
          environment.apiUrl + 'magic/modules/anarq/admin/comment?id=' + id);
      },

      /**
       * Hard deletes a post, and all of its descendants too.
       * Notice, you probably want to use moderatePost instead.
       * 
       * @param id Post to delete
       * @returns Whether or not operation was success or not
       */
       deletePost: (id: number) => {
        return this.httpClient.delete(
          environment.apiUrl + 'magic/modules/anarq/admin/post?id=' + id);
      },

      /**
       * Moderates a comment in the backend, making it invisible for all but
       * moderators, admins, and root account.
       * 
       * @param id Comment to moderate
       * @returns Whether or not operation was success or not
       */
      moderateComment: (id: number) => {
        return this.httpClient.delete(
          environment.apiUrl + 'magic/modules/anarq/admin/moderate-comment?id=' + id);
      },

      /**
       * Moderates a post in the backend, making it invisible for all but
       * moderators, admins, and root account.
       * 
       * @param id Post to moderate
       * @returns Whether or not operation was success or not
       */
       moderatePost: (id: number) => {
        return this.httpClient.delete(
          environment.apiUrl + 'magic/modules/anarq/admin/moderate-post?id=' + id);
      },

      /**
       * Returns information about a specific user
       * 
       * @param username Username to retrieve information about
       * @returns Profile information related to user
       */
      user: (username: string) => {
        return this.httpClient.get(
          environment.apiUrl + 'magic/modules/anarq/admin/user?username=' +
          encodeURIComponent(username));
      },
    };
  }

  /**
   * Allows users to create, read, update and delete comments in the backend.
   */
  get comments() {
    return {

      /**
       * Allows an authenticated user to soft delete one of his previously created comments.
       * 
       * @param id Comment to delete
       * @returns Whether or not opertaion was successful
       */
      delete: (id: number) => {
        return this.httpClient.delete(
          environment.apiUrl + 'magic/modules/anarq/comments/comment?id=' + id);
      },

      /**
       * Allows an authenticated user to create a new comment to a post or another comment.
       * 
       * @param parent Parent comment or post user wants to associate his or her reply towards
       * @param content Actual Markdown content of comment
       * @param visibility Visibility, typically 'public' or 'protected'
       * @returns 
       */
      create: (parent: number, content: string, visibility: string) => {
        return this.httpClient.post(
          environment.apiUrl + 'magic/modules/anarq/comments/comment', {
            parent,
            content,
            visibility,
          });
      },

      /**
       * Allows an authenticated user to modify a previously created comment.
       * Notice, users can only modify their own comments.
       * 
       * @param id Id of previously created comment
       * @param content New Markdown content of comment
       * @param visibility New visibility, typically 'public' or 'protected'
       * @returns 
       */
       update: (id: number, content: string, visibility: string) => {
        return this.httpClient.put(
          environment.apiUrl + 'magic/modules/anarq/comments/comment', {
            id,
            content,
            visibility,
          });
      },

      /**
       * Returns comments associated with a single post.
       * 
       * @param parent Parent post to retrieve comments for
       * @param limit Maximum number of comments to return
       * @param offset Offset of where to start fetching comments
       */
      get: (parent: number, limit: number = 25, offset: number = 0) => {
        return this.httpClient.get(
          environment.apiUrl + 'magic/modules/anarq/comments/comments?parent=' + parent +
          '&limit=' + limit + '&offset=' + offset);
      }
    };
  }

  /**
   * Allows users to retrieve likes, create likes, return likers, etc associated
   * with posts and comments.
   */
  get licks() {
    return {

      /**
       * Removes a previously lick from a post or a comment.
       * 
       * @param id Id of lick to delete
       * @returns Whether or not operation was successful
       */
      unlick: (id: number) => {
        return this.httpClient.delete(
          environment.apiUrl + 'magic/modules/anarq/licks/lick?id=' + id);
      },

      /**
       * Allows an authenticated user to lick a post or comment.
       * 
       * @param id Comment or post to lick
       * @returns Whether or not operation was a success
       */
      lick: (id: number) => {
        return this.httpClient.post(
          environment.apiUrl + 'magic/modules/anarq/licks/lick', {
            id
          });
      },

      /**
       * Retrieves all users that licked a specific post or comment.
       * 
       * @param id Id of post or comment
       * @returns All users that licked the specified post or comment
       */
      lickers: (id: number) => {
        return this.httpClient.get(
          environment.apiUrl + 'magic/modules/anarq/licks/lickers?id=' + id);
      },
    };
  }
}
