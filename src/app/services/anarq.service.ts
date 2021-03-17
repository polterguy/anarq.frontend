import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnarqService {

  constructor(private httpClient: HttpClient) { }

  get site () {
    return {
      page: (url: string) => {
        return this.httpClient.get(environment.apiUrl + 'magic/modules/anarq/site/page?url=' + encodeURIComponent(url));
      },
      pages: () => {
        return this.httpClient.get(environment.apiUrl + 'magic/modules/anarq/site/pages');
      }
    };
  }
}
