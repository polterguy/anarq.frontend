/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { CaseSlim } from 'src/app/models/case-slim';
import { PublicService } from 'src/app/services/http/public.service';
import { RegionsModel } from 'src/app/models/regions-model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public cases: CaseSlim[] = [];
  private more: boolean;
  public regions: RegionsModel = null;
  public canCreateCase = false;

  constructor(
    private httpService: PublicService,
    private jwtHelper: JwtHelperService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    let username = null;
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const parsed = this.jwtHelper.decodeToken(token);
      username = parsed.unique_name;
    }
    this.httpService.getOpenCases(null, null, username).subscribe(res => {
      this.cases = res;
      this.more = res !== null && res.length === 25;
    }, err => {
      this.snackBar.open(
        err.errror.message,
        'ok', {
          duration: 5000
        });
    });
    if (this.isLoggedIn()) {
      this.httpService.getMyRegions().subscribe(res => {
        this.regions = res;
      }, err => {
        this.snackBar.open(
          err.errror.message,
          'ok', {
            duration: 5000
          });
      });
      this.httpService.canCreateCase('norge').subscribe(res => {
        this.canCreateCase = res.result === 'SUCCESS';
      }, err => {
        this.snackBar.open(
          err.errror.message,
          'ok', {
            duration: 5000
          });
      });
    }
  }

  getMore() {
    let username = null;
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const parsed = this.jwtHelper.decodeToken(token);
      username = parsed.unique_name;
    }
    this.httpService.getOpenCases(this.cases.length, null, username).subscribe(res => {
      this.more = res && res.length === 25;
      this.cases = this.cases.concat(res);
    }, err => {
      this.snackBar.open(
        err.errror.message,
        'ok', {
          duration: 5000
        });
    });
  }

  getCount(item: CaseSlim) {
    return item.positive + '/' + (item.votes - item.positive);
  }

  hasNoCases() {
    return !this.cases || this.cases.length === 0;
  }

  // Returns true if user is logged in, with a valid token, that's not expired.
  isLoggedIn() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      return false;
    }
    if (this.jwtHelper.isTokenExpired(token)) {
      return false;
    }
    return true;
  }
}
