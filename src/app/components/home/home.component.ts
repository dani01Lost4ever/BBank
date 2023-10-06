import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle } from "ng-apexcharts";
import * as ApexCharts from 'apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, AccountBalance, User } from 'src/app/services/auth.service';
import { BankService, ListTransactions, Transactions } from "src/app/services/bank.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogDetailComponent } from "../dialog-detail/dialog-detail.component";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {
  me: User | undefined | null;
  balance: number | undefined | null;
  private destroyed$ = new Subject<void>();

  @ViewChild("chart", { static: false }) chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;

  constructor(private authService: AuthService,
              private bankService: BankService,
              public dialog: MatDialog) {
    this.chartOptions = {
      series: [{
          name: "€",
          data: [],
          color: "#008B8B"
      }],
      chart: {
        height: 450,
        width: "100%",
        type: "area",
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: 'smooth',
        colors: ['#008B8B']
      },
      title: {
        text: 'Grafico di bilancio',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: []  
      }
    };

    authService.currentUser$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(value => this.me = value)
    authService.getBalance()
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(value => this.balance = value.accout[0].balance)
    bankService.transactions$.subscribe(value => {
      const v = value as ListTransactions;
      this.updateSeries(v);
    })
  }

  public updateSeries(transaction: ListTransactions | null) {
    this.chartOptions!.series = [];
    const arr = transaction?.transactions.map(value => {
      return value.balance;
    });
    const arr2 = transaction?.transactions.map(value => {
      const v = new Date(value.date).toLocaleDateString()
      return v;
    })
    this.chartOptions!.xaxis = {
      categories: arr2!.reverse(),
      min: undefined,
      max: 5
    }
    this.chartOptions!.series = [{
      name: "€",
      data: arr!.reverse(),
      color: "#008B8B"
    }];
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
