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
        return this.httpClient.get(environment.apiUrl + 'magic/modules/anarq/site/page?url=' + encodeURIComponent(url));
      },

      /**
       * Retrieves all pages from your backend.
       * 
       * @returns All pages in your database
       */
      list: () => {
        return this.httpClient.get(environment.apiUrl + 'magic/modules/anarq/site/pages');
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
        return this.httpClient.post(environment.apiUrl + 'magic/modules/anarq/site/page', {
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
        return this.httpClient.put(environment.apiUrl + 'magic/modules/anarq/site/page', {
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
        return this.httpClient.delete(environment.apiUrl + 'magic/modules/anarq/site/page?url=' + encodeURIComponent(url));
      }
    };
  }
}
