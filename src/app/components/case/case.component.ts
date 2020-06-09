/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { CaseService } from 'src/app/services/http/case.service';
import { ActivatedRoute } from '@angular/router';
import { CaseView } from 'src/app/models/case-view';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss']
})
export class CaseComponent implements OnInit {

  public item: CaseView = null;

  constructor(
    private service: CaseService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(pars => {
      this.service.getCase(pars.hash).subscribe(res => {
        this.item = res;
      });
    });
  }

  getCaseUrl() {
    return window.location.href;
  }
}
