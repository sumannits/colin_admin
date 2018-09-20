import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from "./coustomer-routing";
import { CustomersComponent } from './customers.component';
import { CustomerService } from '../../services/customer.service';
import { DashboardService } from '../../services/dashboard.service';
import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DataTableModule } from 'angular-4-data-table';

import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ReportsComponent } from './reports/reports.component';
import { ViewComponent } from './view/view.component';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { AgmCoreModule } from '@agm/core';
import { AllcustomerComponent } from './allcustomer/allcustomer.component';
@NgModule({
  imports: [
    CommonModule,
    CustomersRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    DataTableModule,
    AngularMultiSelectModule,
    Ng4GeoautocompleteModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDYFY2fp_meJiSEKve5pDJk9Kzr_oDOlPk',
      libraries: ['places']
    }),
  ],
  declarations: [CustomersComponent, AddComponent, EditComponent, ReportsComponent, ViewComponent, AllcustomerComponent],
  providers:[
    CustomerService,
    DashboardService
  ]
})
export class CustomersModule { 
  constructor(){
    
  }
 }
