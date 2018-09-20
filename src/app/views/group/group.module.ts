import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupRoutingModule } from './group-routing';
import { GroupService } from '../../services/group.service';
import { DashboardService } from '../../services/dashboard.service';
import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TinymceModule } from 'angular2-tinymce';
import { absEnvironment } from '../../../environments/environment';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DataTableModule } from 'angular-4-data-table';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete'
import { AgmCoreModule } from '@agm/core';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { GroupComponent } from './group.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { AddSubgrpComponent } from './add-subgrp/add-subgrp.component';
import { EditSubgrpComponent } from './edit-subgrp/edit-subgrp.component';
import { ReportsComponent } from './reports/reports.component';
import { ChatComponent } from './chat/chat.component';
import { ViewSubgrpComponent } from './view-subgrp/view-subgrp.component';

@NgModule({
  imports: [
    CommonModule,
    GroupRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    Ng4GeoautocompleteModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDYFY2fp_meJiSEKve5pDJk9Kzr_oDOlPk',
      libraries: ['places']
    }),
    TinymceModule.withConfig({
      skin_url: absEnvironment.absuluteUrl
    }),
    MultiselectDropdownModule,
    Ng2SearchPipeModule,
    AngularMultiSelectModule,
    DataTableModule
  ],
  declarations: [GroupComponent, AddComponent, EditComponent, ViewComponent, AddSubgrpComponent, EditSubgrpComponent, ReportsComponent, ChatComponent,ViewSubgrpComponent],
  providers:[
    GroupService,
    DashboardService
  ]
})
export class GroupModule { }
