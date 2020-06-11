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
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss']
})
export class CaseComponent implements OnInit {

  public item: CaseView = null;
  public id: number;

  constructor(
    private service: PublicService,
    private jwtHelper: JwtHelperService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(pars => {
      this.id = +pars.id;
      this.service.getCase(pars.id).subscribe(res => {
        this.item = res;
      });
    });
  }

  getCaseUrl() {
    return window.location.href;
  }

  yes() {
    this.service.vote(this.id, true).subscribe(res => {
      this.item.opinion = true;
      this.snackBar.open('Your vote has been registered', 'ok');
    }, err => {
      this.snackBar.open(err.error.message, 'ok');
    });
  }

  no() {
    this.service.vote(this.id, false).subscribe(res => {
      this.item.opinion = false;
      this.snackBar.open('Your vote has been registered', 'ok');
    }, err => {
      this.snackBar.open(err.error.message, 'ok');
    });
  }

  getOpinion() {
    if (this.item.opinion) {
      return 'yes';
    } else {
      return 'no';
    }
  }

  getClass() {
    if (this.item.opinion) {
      return 'yes';
    } else {
      return 'no';
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
