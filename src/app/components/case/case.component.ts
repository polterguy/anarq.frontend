/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseView } from 'src/app/models/case-view';
import { PublicService } from 'src/app/services/http/public.service';
import { ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss']
})
export class CaseComponent implements OnInit {

  public item: CaseView = null;

  constructor(
    private service: PublicService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(pars => {
      this.service.getCase(pars.id).subscribe(res => {
        this.item = res;
      });
    });
  }

  getCaseUrl() {
    return window.location.href;
  }
}
