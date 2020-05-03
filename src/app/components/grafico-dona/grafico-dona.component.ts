import { Component, OnInit, Input } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: [
  ]
})
export class GraficoDonaComponent implements OnInit {

  // Doughnut
  @Input() public doughnutChartLabels: Label[] = ['']; // ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  // public doughnutChartData: MultiDataSet = [
  //   [350, 450, 100]
  // ];
  @Input() public doughnutChartData: number[] = []; // [350, 450, 100];
  public doughnutChartType: ChartType = 'doughnut';
  @Input() leyenda = '';

  constructor() { }

  ngOnInit(): void {
  }

}
