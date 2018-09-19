/**
 * Created by rmudragalla on 10/24/2017.
 */
import { Component, Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AppSettings } from '../shared/appSettings';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginService {

  private readonly headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private readonly _http: Http) {

  }

//
  public authenticate(username, password) {
    const loginURL = AppSettings.API_LOGIN;
    const url = `${loginURL}`;

    this.headers.append("Authorization", "Basic " + btoa(username + `:${password}`));
    return this._http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(response => {
        localStorage.setItem("Autherization", JSON.stringify("Basic " + btoa(username + `:${password}`)));

        return response.json();
      })
      .catch(error => {
        this.headers.delete("Authorization");
        return error;
      });

  }


}
