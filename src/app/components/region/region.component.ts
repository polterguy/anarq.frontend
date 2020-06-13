/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicService } from 'src/app/services/http/public.service';
import { CaseSlim } from 'src/app/models/case-slim';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit {

  public cases: CaseSlim[];
  private more: boolean;
  public region: string = null;
  public canCreateCase = false;

  constructor(
    private service: PublicService,
    private route: ActivatedRoute,
    private router: Router,
    private jwtHelper: JwtHelperService) {}

  ngOnInit() {
    let username = null;
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const parsed = this.jwtHelper.decodeToken(token);
      username = parsed.unique_name;
    }
    this.route.params.subscribe(pars => {
      this.region = pars.region;
      this.service.getOpenCases(null, this.region, username).subscribe(res => {
        this.cases = res;
        this.more = res !== null && res.length === 25;
      });
      if (this.isLoggedIn()) {
        this.service.canCreateCase(this.region).subscribe(res => {
          this.canCreateCase = res.result === 'SUCCESS';
        });
      }
    });
  }

  getMore() {
    let username = null;
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const parsed = this.jwtHelper.decodeToken(token);
      username = parsed.unique_name;
    }
    this.service.getOpenCases(this.cases.length, this.region, username).subscribe(res => {
      this.more = res && res.length === 25;
      this.cases = this.cases.concat(res);
    });
  }

  getCount(item: CaseSlim) {
    return item.positive + '/' + item.votes;
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

  askQuestion() {
    this.router.navigate(['/ask/' + this.region]);
  }
}
