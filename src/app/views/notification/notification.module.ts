import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NotificationRoutingModule } from "./notification.routing";
import { DashboardService } from '../../services/dashboard.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DataTableModule } from 'angular-4-data-table';
import { NotificationComponent } from './notification.component';

@NgModule({
  imports: [
    CommonModule,
    NotificationRoutingModule,
    Ng2SearchPipeModule,
    DataTableModule,
    FormsModule
  ],
  declarations: [NotificationComponent],
  providers:[
    DashboardService
  ]
})
export class NotificationModule { }
