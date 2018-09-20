import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityRoutingModule } from './community-routing';
import { CommunityComponent } from './community.component';
import { CommunityService } from '../../services/community.service';
import { DashboardService } from '../../services/dashboard.service';
import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
// import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { TinymceModule } from 'angular2-tinymce';
import { absEnvironment } from '../../../environments/environment';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DataTableModule } from 'angular-4-data-table';
import { ViewComponent } from './view/view.component';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete'
import { AgmCoreModule } from '@agm/core';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ReportsComponent } from './reports/reports.component';
import { NodeaddComponent } from './nodeadd/nodeadd.component';
import { NodeeditComponent } from './nodeedit/nodeedit.component';
import { NodeviewComponent } from './nodeview/nodeview.component';
import { NodelistComponent } from './nodelist/nodelist.component';

@NgModule({
  imports: [
    CommonModule,
    CommunityRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
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
    DataTableModule,
    AngularMultiSelectModule
  ],
  declarations: [CommunityComponent, AddComponent, EditComponent, ViewComponent, ReportsComponent, NodeaddComponent, NodeeditComponent, NodeviewComponent, NodelistComponent],
  providers:[
    CommunityService,
    DashboardService
  ]
})
export class CommunityModule { }
