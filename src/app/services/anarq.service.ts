
/*
 * AnarQ backend HTTP service, and models.
 *
 * This file assumes you have declared the 'apiUrl' method in your environment.ts file,
 * such as the following is an example of.
 * 
 * export const environment = {
 *   production: false,
 *   apiUrl: () => {
 *    return 'http://localhost:55247/';
 *   },
 * };
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * A single topic.
 */
 export class Topic {
  name: string;
  description: string;
  items: number;
  last_activity: Date;
}

/**
 * Count result model.
 */
 export class CountModel {
  count: number;
}

/**
 * Profile mode for currently authenticated user.
 */
 export class Profile {
  email: string;
  created: Date;
  full_name: string;
  locked: boolean;
  roles: string[];
  payPalId: string;
  email_notifications: boolean;
}

/**
 * Result returned by some endpoints when item was successfully created.
 */
 export class CreateModel {
  id: number;
}

/**
 * User model, wrapping a single user in the system.
 */
 export class User {
  comments: number;
  full_name: string;
  karma: number;
  licks: number;
  posts: number;
  roles: string[];
  payPalId: string;
}

/**
 * User excerpt model, wrapping a single user in the system, but only partially.
 */
 export class UserExcerpt {
  user: string;
  karma: number;
}

/**
 * Result returned by some endpoints when endpoint was successfully invoked.
 */
 export class ResultModel {
  result: string;
}

/**
 * Model returned by some endpoints indicating availability of resource.
 */
 export class EntityAvailable {
  result: boolean;
  message: string;
}

/**
 * Number of items affected by operation.
 */
 export class Affected {
  affected: number;
}

/**
 * Authenticate model, returned from backend when user authenticates
 * with a username and a password.
 */
export class AuthenticateModel {
  ticket: string;
}

/**
 * Post excerpt, implying not entire content.
 */
export class PostExcerpt {
  id: number;
  created: Date;
  excerpt: string;
  licks: number;
  topic: string;
  user: string;
  visibility: string;
}

/**
 * Post including full content.
 */
export class Post {
  id: number;
  created: Date;
  content: string;
  licks: number;
  topic: string;
  user: string;
  visibility: string;
}

/**
 * Comment including full content.
 */
 export class Comment {
  id: number;
  created: Date;
  content: string;
  licks: number;
  user: string;
  visibility: string;
}

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
        return this.httpClient.get<AuthenticateModel>(
          environment.apiUrl() + 'magic/modules/anarq/profile/authenticate?username=' +
          encodeURIComponent(username) + '&password=' + encodeURIComponent(password));
      },

      /**
       * Registers a new user on site.
       * 
       * @param username Chosen username
       * @param password Chosen password
       * @param email Email of user
       * @param fullName Full name of user
       * @returns Whether or not operation was a success
       */
       register: (username: string, password: string, email: string, fullName: string) => {
        return this.httpClient.post<ResultModel>(
          environment.apiUrl() + 'magic/modules/anarq/profile/register', {
            username,
            password,
            email,
            full_name: fullName,
            email_type: 'web'
        });
      },

      /**
       * Checks if an username is available or not.
       * 
       * @param username Username to check
       * @returns Success if username is available
       */
       usernameAvailable: (username: string) => {
        return this.httpClient.get<EntityAvailable>(
          environment.apiUrl() + 'magic/modules/anarq/profile/username-available?username=' +
          encodeURIComponent(username));
      },

      /**
       * Checks if an email address is available or not.
       * 
       * @param email Email address to check
       * @returns Success if email address is available
       */
       emailAvailable: (email: string) => {
        return this.httpClient.get<EntityAvailable>(
          environment.apiUrl() + 'magic/modules/anarq/profile/email-available?email=' +
          encodeURIComponent(email));
      },

      /**
       * Allows a user to confirms his or her email address.
       * 
       * @param email Email address of user
       * @param secret Secret sent to user's email address
       * @returns Whether or not operation was a success
       */
      confirmEmail: (email: string, secret: string) => {
        return this.httpClient.post<AuthenticateModel>(
          environment.apiUrl() + 'magic/modules/anarq/profile/confirm-email', {
            email,
            secret,
          }
        );
      },

      /**
       * Returns profile information for the currently authenticated user.
       * 
       * @returns Information for the currently authenticated user
       */
      me: () => {
        return this.httpClient.get<Profile>(
          environment.apiUrl() + 'magic/modules/anarq/profile/me');
      },

      /**
       * Stores user's PayPalID
       * 
       * @param payPalId New PayPalID for user
       * @returns Whether or not invocation was a success
       */
       storePayPalId: (payPalId: string) => {
        return this.httpClient.put<ResultModel>(
          environment.apiUrl() + 'magic/modules/anarq/profile/paypal-id', {
            payPalId
          });
      },

      /**
       * Stores user's email notifications preferences
       * 
       * @param notifications Whether or not user wants to have email notifications from AnarQ
       * @returns Whether or not invocation was a success
       */
       storeEmailNotifications: (notifications: boolean) => {
        return this.httpClient.put<ResultModel>(
          environment.apiUrl() + 'magic/modules/anarq/profile/email-notifications', {
            notifications
          });
      },
    }
  }

  /**
   * Allows users to retrieve posts, create posts, see their feed, etc.
   */
   get posts() {
    return {

      /**
       * Returns the feed from backend.
       * 
       * @param topic Topic to filter feed according to
       * @param username Filter of user to return posts for 
       * @param minutes Maximum age in minutes of posts to include in feed
       * @param limit Maximum number of posts to return
       * @param offset Offset of where to start returning items from
       * @returns All posts matching specified conditions
       */
      feed: (
        topic: string = null,
        username: string = null,
        minutes: number = null,
        limit: number = 10,
        offset: number = 0) => {
        let query = '?limit=' + limit;
        if (topic) {
          query += '&topic=' + topic;
        }
        if (username) {
          query += '&username=' + username;
        }
        if (minutes) {
          query += '&minutes=' + minutes;
        }
        if (offset && offset !== 0) {
          query += '&offset=' + offset;
        }
        return this.httpClient.get<PostExcerpt[]>(
          environment.apiUrl() + 'magic/modules/anarq/posts/feed' + query);
      },

      /**
       * Retrieves a post, including its number of licks.
       * 
       * @param id Id of post to return
       * @returns The post content, in addition to its number of licks
       */
       get: (id: number) => {
        return this.httpClient.get<Post>(
          environment.apiUrl() + 'magic/modules/anarq/posts/post?id=' + id);
      },

      /**
       * Creates a new post in the backend.
       * 
       * @param content Markdown content of post
       * @param topic What topic to associate post with
       * @param visibility Visibility of post, typically 'public' or 'protected'
       * @param hyperlink Optional hyperlink for post
       * @returns Whether or not operation was a success
       */
       create: (
        content: string,
        topic: string,
        visibility: string,
        hyperlink: string = null) => {
        return this.httpClient.post<CreateModel>(
          environment.apiUrl() + 'magic/modules/anarq/posts/post', {
            content,
            topic,
            visibility,
            hyperlink,
          });
      },

      /**
       * 
       * @param id Id of post to update
       * @param content New Markdown content for post
       * @param visibility New visibility for post
       * @returns Whether or not operation was a success
       */
       update: (
         id: number,
         content: string,
         topic: string,
         visibility: string,
         hyperlink: string) => {
        return this.httpClient.put<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/posts/post', {
            id,
            content,
            topic,
            visibility,
            hyperlink,
          });
      },

      /**
       * Soft deletes the specified post.
       * Notice, users can only delete their own posts.
       * 
       * @param id Id of post to delete
       * @returns Whether or not operation was a success or not
       */
      delete: (id: number) => {
        return this.httpClient.delete<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/posts/post?id=' + id);
      },

      /**
       * Counts number of posts from backend.
       * 
       * @param topic Topic to filter counting within
       * @param username If specified, only count posts by user
       * @returns Number of posts matching your optional condition(s)
       */
      count: (topic: string = null, username: string = null) => {
        let query = '';
        if (topic) {
          query += '?topic=' + topic;
        }
        if (username) {
          if (query === '') {
            query += '?';
          } else {
            query += '&';
          }
          query += 'username=' + username;
        }
        return this.httpClient.get<CountModel>(
          environment.apiUrl() + 'magic/modules/anarq/posts/posts-count' + query);
      },

      /**
       * Returns posts matching the specified conditions(s).
       * 
       * @param topic Optional topic to retrieve posts from within
       * @param username Optional username having created the post
       * @param limit Maximum number of posts to return
       * @param offset Offset of where to start returning posts
       * @returns All posts matching specified condition(s)
       */
      list: (
        topic: string = null,
        username: string = null,
        limit: number = 25,
        offset: number = 0) => {
        let query = '?limit=' + limit + '&offset=' + offset;
        if (topic) {
          query += '&topic=' + topic;
        }
        if (username) {
          query += '&username=' + username;
        }
        return this.httpClient.get<PostExcerpt[]>(
          environment.apiUrl() + 'magic/modules/anarq/posts/posts' + query);
      },
    };
  }

  /**
   * Allows users to create, read, update and delete comments in the backend.
   */
   get comments() {
    return {

      /**
       * Allows an authenticated user to create a new comment to a post or another comment.
       * 
       * @param parent Parent comment or post user wants to associate his or her reply towards
       * @param content Actual Markdown content of comment
       * @returns Whether or not operation was a success
       */
       create: (parent: number, content: string) => {
        return this.httpClient.post<CreateModel>(
          environment.apiUrl() + 'magic/modules/anarq/comments/comment', {
            parent,
            content,
          });
      },

      /**
       * Allows an authenticated user to modify a previously created comment.
       * Notice, users can only modify their own comments.
       * 
       * @param id Id of previously created comment
       * @param content New Markdown content of comment
       * @param visibility New visibility, typically 'public' or 'protected'
       * @returns Whether or not operation was a success
       */
       update: (id: number, content: string, visibility: string) => {
        return this.httpClient.put<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/comments/comment', {
            id,
            content,
            visibility,
          });
      },

      /**
       * Allows an authenticated user to soft delete one of his previously created comments.
       * 
       * @param id Comment to delete
       * @returns Whether or not opertaion was successful
       */
      delete: (id: number) => {
        return this.httpClient.delete<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/comments/comment?id=' + id);
      },

      /**
       * Returns comments associated with a single post.
       * 
       * @param parent Parent post to retrieve comments for
       * @param limit Maximum number of comments to return
       * @param offset Offset of where to start fetching comments
       * @returns Comment content, and other information associated with comment
       */
      list: (parent: number, limit: number = 25, offset: number = 0) => {
        return this.httpClient.get<Comment[]>(
          environment.apiUrl() + 'magic/modules/anarq/comments/comments?parent=' + parent +
          '&limit=' + limit + '&offset=' + offset);
      },

      /**
       * Counts number of comments from backend.
       * 
       * @param topic Topic to filter within
       * @param username If specified, only count comments by user
       * @returns Number of comments matching your optional condition(s)
       */
       count: (topic: string = null, username: string = null) => {
        let query = '';
        if (topic) {
          query += '?topic=' + topic;
        }
        if (username) {
          if (query === '') {
            query += '?';
          } else {
            query += '&';
          }
          query += 'username=' + username;
        }
        return this.httpClient.get<CountModel>(
          environment.apiUrl() + 'magic/modules/anarq/comments/comments-count' + query);
      },
    };
  }

  /**
   * Allows users to retrieve likes, create likes, return likers, etc associated
   * with posts and comments.
   */
   get licks() {
    return {

      /**
       * Allows an authenticated user to lick a post or comment.
       * 
       * @param id Comment or post to lick
       * @returns Whether or not operation was a success
       */
       lick: (id: number) => {
        return this.httpClient.post<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/licks/lick', {
            id
          });
      },

      /**
       * Removes a previously lick from a post or a comment.
       * 
       * @param id Id of lick to delete
       * @returns Whether or not operation was successful
       */
      unlick: (id: number) => {
        return this.httpClient.delete<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/licks/lick?id=' + id);
      },

      /**
       * Retrieves all users that licked a specific post or comment.
       * 
       * @param id Id of post or comment
       * @returns All users that licked the specified post or comment
       */
      lickers: (id: number) => {
        return this.httpClient.get<string[]>(
          environment.apiUrl() + 'magic/modules/anarq/licks/lickers?id=' + id);
      },
    };
  }

  /**
   * Allows you to administrate topics in the system
   */
   get topics() {
    return {

      /**
       * Creates a new topic in your backend.
       * 
       * @param name Name of new topic to create
       * @param description Descriptive text for topic to create
       * @returns 
       */
       create: (name: string, description: string) => {
        return this.httpClient.post<ResultModel>(
          environment.apiUrl() + 'magic/modules/anarq/topics/topic', {
            name,
            description,
          });
      },

      /**
       * Updates an existing topic in your backend.
       * 
       * @param name Name of topic to update
       * @param description New descriptive text for topic
       * @returns 
       */
      update: (name: string, description: string) => {
        return this.httpClient.put<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/topics/topic', {
            name,
            description,
          });
      },

      /**
       * Deletes the specified topic from the backend.
       * 
       * @param name Name of topic to delete
       * @returns 
       */
      delete: (name: string) => {
        return this.httpClient.delete<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/topics/topic?name=' + encodeURIComponent(name));
      },

      /**
       * Retrieves all topics from backend.
       * 
       * @returns Returns all topics from backend
       */
      list: () => {
        return this.httpClient.get<Topic[]>(
          environment.apiUrl() + 'magic/modules/anarq/topics/topics');
      },

      /**
       * Retrieves all topics from backend. Notice, this service endpoint
       * does not cache anything.
       * 
       * @returns Returns all topics from backend
       */
      listNoCache: () => {
        return this.httpClient.get<Topic[]>(
          environment.apiUrl() + 'magic/modules/anarq/topics/topics-no-cache');
      }
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
       * @returns Whether or not operation was a success
       */
      deleteComment: (id: number) => {
        return this.httpClient.delete<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/admin/comment?id=' + id);
      },

      /**
       * Hard deletes a post, and all of its descendants too.
       * Notice, you probably want to use moderatePost instead.
       * 
       * @param id Post to delete
       * @returns Whether or not operation was a success
       */
       deletePost: (id: number) => {
        return this.httpClient.delete<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/admin/post?id=' + id);
      },

      /**
       * Moderates a comment in the backend, making it invisible for all but
       * moderators, admins, and root account.
       * 
       * @param id Comment to moderate
       * @returns Whether or not operation was a success
       */
      moderateComment: (id: number) => {
        return this.httpClient.delete<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/admin/moderate-comment?id=' + id);
      },

      /**
       * Un-moderates a comment in the backend, making it public for all again.
       * 
       * @param id Comment to moderate
       * @returns Whether or not operation was a success
       */
       unModerateComment: (id: number) => {
        return this.httpClient.delete<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/admin/un-moderate-comment?id=' + id);
      },

      /**
       * Moderates a post in the backend, making it invisible for all but
       * moderators, admins, and root account.
       * 
       * @param id Post to moderate
       * @returns Whether or not operation was a success
       */
       moderatePost: (id: number) => {
        return this.httpClient.delete<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/admin/moderate-post?id=' + id);
      },

      /**
       * Un-moderates a post in the backend, making it public for all.
       * 
       * @param id Post to moderate
       * @returns Whether or not operation was a success
       */
       unModeratePost: (id: number) => {
        return this.httpClient.delete<Affected>(
          environment.apiUrl() + 'magic/modules/anarq/admin/un-moderate-post?id=' + id);
      },

      /**
       * Blocks the specified user.
       * 
       * @param username User to block
       * @returns Whether or not operation was a success
       */
      blockUser: (username: string) => {
        return this.httpClient.delete<ResultModel>(
          environment.apiUrl() + 'magic/modules/anarq/admin/block-user?username=' +
          encodeURIComponent(username));
      },

      /**
       * Unblocks the specified user.
       * 
       * @param username User to unblock
       * @returns Whether or not operation was a success
       */
       unblockUser: (username: string) => {
        return this.httpClient.delete<ResultModel>(
          environment.apiUrl() + 'magic/modules/anarq/admin/un-block-user?username=' +
          encodeURIComponent(username));
      },
    };
  }

  /**
   * Allows you to retrieve users from your backend.
   */
   get users() {
    return {

      /**
       * Retrieves the specified user from the backend.
       * 
       * @param username Username of user to return
       * @returns The user with the specified username
       */
      get: (username: string) => {
        return this.httpClient.get<User>(
          environment.apiUrl() + 'magic/modules/anarq/users/user?username=' +
          encodeURIComponent(username));
      },

      /**
       * Retrieves users from the backend.
       * 
       * @param limit Maximum number of users to return
       * @param offset Offset of where to start returning users
       * @returns Users matching the specified condition(s)
       */
      list: (limit: number = 25, offset: number = 0) => {
        return this.httpClient.get<UserExcerpt[]>(
          environment.apiUrl() + 'magic/modules/anarq/users/users?limit=' + limit +
          '&offset=' + offset);
      },

      /**
       * Counts number of users from backend.
       * 
       * @returns Number of users in the system
       */
       count: () => {
        return this.httpClient.get<CountModel>(
          environment.apiUrl() + 'magic/modules/anarq/users/users-count');
      },
    };
  }

  /**
   * Returns miscelanous methods, such as PayPal donate configuration retriever, etc.
   */
  get misc() {
    return {

      /**
       * Returns true if donations are turned on for the site.
       * 
       * @returns Whether or not donations have been turned on for the site or not.
       */
       donations: () => {
        return this.httpClient.get<boolean>(
          environment.apiUrl() + 'magic/modules/anarq/misc/donations');
      },

      /**
       * Logs a donation to an author by invoking server.
       * 
       * @param user User that received the donation
       * @param donator Email address of person donating to user
       * @param amount Amount that was donated
       * @returns Whether or not operation was successful
       */
       logDonation: (user: string, donator: string, amount: number) => {
        return this.httpClient.post<ResultModel>(
          environment.apiUrl() + 'magic/modules/anarq/misc/log-donation', {
            user,
            donator,
            amount
          });
      },

      /**
       * Returns client ID for PayPal account associated with page wide donations.
       * Notice, each user might also have his or her own PayPal ID associated with themselves.
       * 
       * @returns ClientID needed to make PayPal donations work
       */
      payPalClientId: () => {
        return this.httpClient.get<ResultModel>(
          environment.apiUrl() + 'magic/modules/anarq/misc/paypal-configuration');
      },

      /**
       * Returns client ID for PayPal account associated with donations.
       * 
       * @returns ClientID needed to make PayPal donations work
       */
       termsAndConditions: () => {
        return this.httpClient.get<ResultModel>(
          environment.apiUrl() + 'magic/modules/anarq/misc/tnc')
      }
    }
  }
}
