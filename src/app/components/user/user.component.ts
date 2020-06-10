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

  private pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
  };
  private barChartOptions: ChartOptions = {
    responsive: true,
    showLines: false,
    scales: {
      display: false,
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        display: false,
      }]
    },
    legend: {
      display: false
    },
  };

  private pieChartLabels: Label[] = [];
  private barChartLabels: Label[] = [];

  private pieChartData: number[] = [];
  private barChartData: number[] = [];

  private pieChartColors = [{
      backgroundColor: [
        'rgba(200,255,200,0.8)',
        'rgba(255,200,200,0.8)'
      ]}];
  private barChartColors = [{
    backgroundColor: [
      'rgba(15,15,15,0.8)',
      'rgba(30,30,30,0.8)',
      'rgba(45,45,45,0.8)',
      'rgba(60,60,60,0.8)',
      'rgba(75,75,75,0.8)',
      'rgba(90,90,90,0.8)',
      'rgba(105,105,105,0.8)',
      'rgba(120,120,120,0.8)',
      'rgba(135,135,135,0.8)',
      'rgba(150,150,150,0.8)',
      'rgba(165,165,165,0.8)',
      'rgba(180,180,180,0.8)',
      'rgba(195,195,195,0.8)',
      'rgba(210,210,210,0.8)',
      'rgba(225,225,225,0.8)',
      'rgba(240,240,240,0.8)',
    ]}];

  constructor(
    private service: PublicService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(pars => {
      this.service.getUser(pars.username).subscribe(res => {
        this.item = res;
        if (this.shouldDisplayVotesChart()) {
          this.pieChartData = [
            res.positive,
            res.negative,
          ];
          this.pieChartLabels = [
            'positive',
            'negative',
          ];
        }
        if (this.shouldDisplayRegionChart()) {
          console.log(this.item);
          this.barChartLabels = this.item.regions.map(x => x.name);
          this.barChartData = this.item.regions.map(x => x.votes);
        }
      });
    });
  }

  shouldDisplayVotesChart() {
    if (!this.item) {
      return false;
    }
    if (this.item.negative === 0 && this.item.positive === 0) {
      return false;
    }
    return true;
  }

  shouldDisplayRegionChart() {
    if (!this.item) {
      return false;
    }
    if (!this.item.regions || this.item.regions.length <= 0) {
      return false;
    }
    return true;
  }
}
