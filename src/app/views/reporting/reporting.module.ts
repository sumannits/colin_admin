import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingComponent } from './reporting.component';
import { ReportingRoutingModule } from "./reporting.routing";
import { DashboardService } from '../../services/dashboard.service';
//import { Ng2SearchPipeModule } from 'ng2-search-filter';
//import { DataTableModule } from 'angular-4-data-table';
import { ChartModule,MessagesModule,GrowlModule,TabViewModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    ReportingRoutingModule,
    //Ng2SearchPipeModule,
    ChartModule,
    MessagesModule,
    GrowlModule,
    TabViewModule,
    //DataTableModule
  ],
  declarations: [ReportingComponent],
  providers:[
    DashboardService
  ]
})
export class ReportingModule { }
