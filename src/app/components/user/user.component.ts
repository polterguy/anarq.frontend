/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserView } from 'src/app/models/user-view';
import { ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { PublicService } from 'src/app/services/http/public.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public item: UserView = null;
  private chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
  };
  private chartLabels: Label[] = [];
  private chartData: number[] = [];
  private chartColors = [{
      backgroundColor: [
        'rgba(200,255,200,0.8)',
        'rgba(255,200,200,0.8)'
      ]},
  ];

  constructor(
    private service: PublicService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(pars => {
      this.service.getUser(pars.username).subscribe(res => {
        this.chartData = [
          res.positive,
          res.negative,
        ];
        this.chartLabels = [
          'positive',
          'negative',
        ];
        this.item = res;
      });
    });
  }

  shouldDisplayChart() {
    if (!this.item) {
      return false;
    }
    if (this.item.negative === 0 && this.item.positive === 0) {
      return false;
    }
    return true;
  }
}
