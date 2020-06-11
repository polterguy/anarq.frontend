/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseView } from 'src/app/models/case-view';
import { PublicService } from 'src/app/services/http/public.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private service: PublicService,
    private jwtHelper: JwtHelperService,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.snackBar.open('You are already registered at this site', 'ok');
    }
  }

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
