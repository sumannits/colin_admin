import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterestRoutingModule } from './interest-routing';
import { InterestComponent } from './interest.component';
import { InterestService } from '../../services/interest.service';
import { CommunityService } from '../../services/community.service';

import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
// import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { TinymceModule } from 'angular2-tinymce';
import { absEnvironment } from '../../../environments/environment';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DataTableModule } from 'angular-4-data-table';
import { ViewComponent } from './view/view.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AlertModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    InterestRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TinymceModule.withConfig({
      skin_url: absEnvironment.absuluteUrl
    }),
    Ng2SearchPipeModule,
    DataTableModule,
    AngularMultiSelectModule,
    AlertModule.forRoot()
  ],
  declarations: [InterestComponent, AddComponent, EditComponent, ViewComponent],
  providers:[
    InterestService,
    CommunityService
  ]
})
export class InterestModule { }
