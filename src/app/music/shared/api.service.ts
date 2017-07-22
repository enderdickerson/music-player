import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import cid from '../../../../local.config';

@Injectable()

export class ApiService {
  clientId = cid();

  constructor(
    private http: Http
  ) {}

  get(url, attachClientId?) {
    let u;
    attachClientId ? u = this.prepareUrl(url) : u = url;

    return this.http.get(u);
  }

  prepareUrl(url) {
    return `${url}?client_id=${this.clientId}`;
  }
}
