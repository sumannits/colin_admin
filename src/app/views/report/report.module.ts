import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ReportComponent } from './report.component';
import { ReportRoutingModule } from "./report.routing";
import { DashboardService } from '../../services/dashboard.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DataTableModule } from 'angular-4-data-table';

@NgModule({
  imports: [
    CommonModule,
    ReportRoutingModule,
    Ng2SearchPipeModule,
    DataTableModule,
    FormsModule
  ],
  declarations: [ReportComponent],
  providers:[
    DashboardService
  ]
})
export class ReportModule { }
