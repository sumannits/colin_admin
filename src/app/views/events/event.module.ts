import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventRoutingModule } from "./event-routing";
import { EventComponent } from './event.component';
import { EventService } from '../../services/events.service';
import { DashboardService } from '../../services/dashboard.service';
import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { TinymceModule } from 'angular2-tinymce';
import { absEnvironment } from '../../../environments/environment';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DataTableModule } from 'angular-4-data-table';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete'
import { AgmCoreModule } from '@agm/core';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DateTimePickerModule } from 'ngx-datetime-picker';
import { ReportsComponent } from './reports/reports.component';
import { ViewComponent } from './view/view.component';
//import {MessageModule} from 'primeng/message';
//import {GrowlModule} from 'primeng/growl';

@NgModule({
  imports: [
    CommonModule,
    EventRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TinymceModule.withConfig({
      skin_url: absEnvironment.absuluteUrl
    }),
    Ng4GeoautocompleteModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDYFY2fp_meJiSEKve5pDJk9Kzr_oDOlPk',
      libraries: ['places']
    }),
    MultiselectDropdownModule,
    Ng2SearchPipeModule,
    AngularMultiSelectModule,
    DataTableModule,
    DateTimePickerModule,
    //MessageModule,
    //GrowlModule
  ],
  declarations: [EventComponent, AddComponent, EditComponent, ReportsComponent, ViewComponent],
  providers:[
    EventService,
    DashboardService
  ]
})
export class EventModule { 
  constructor(){
    
  }
 }
