/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { CaseSlim } from 'src/app/models/case-slim';
import { PublicService } from 'src/app/services/http/public.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public cases: CaseSlim[] = [];
  private more: boolean;

  constructor(private httpService: PublicService) {}

  ngOnInit() {
    this.httpService.getOpenCases().subscribe(res => {
      this.cases = res;
      this.more = res !== null && res.length === 25;
    });
  }

  getMore() {
    this.httpService.getOpenCases(this.cases[this.cases.length - 1].id).subscribe(res => {
      this.more = res && res.length === 25;
      this.cases = this.cases.concat(res);
    });
  }

  hasNoCases() {
    return !this.cases || this.cases.length === 0;
  }
}
