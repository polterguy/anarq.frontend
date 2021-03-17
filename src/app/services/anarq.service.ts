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
   * Allows you to administrate and retrieve pages and other parts
   * associated with your site in general.
   */
  get site () {
    return {

      /**
       * Retrieves a single page from your backend.
       * 
       * @param url What page to return
       * @returns A single page object
       */
      page: (url: string) => {
        return this.httpClient.get(environment.apiUrl + 'magic/modules/anarq/site/page?url=' + encodeURIComponent(url));
      },

      /**
       * Retrieves all pages from your backend.
       * 
       * @returns All pages in your database
       */
      pages: () => {
        return this.httpClient.get(environment.apiUrl + 'magic/modules/anarq/site/pages');
      }
    };
  }
}
