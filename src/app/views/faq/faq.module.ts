import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqRoutingModule } from './faq-routing';
import { FaqComponent } from './faq.component';
import { FaqService } from '../../services/faq.service';

import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
// import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { TinymceModule } from 'angular2-tinymce';
import { absEnvironment } from '../../../environments/environment';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DataTableModule } from 'angular-4-data-table';

@NgModule({
  imports: [
    CommonModule,
    FaqRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TinymceModule.withConfig({
      skin_url: absEnvironment.absuluteUrl
    }),
    Ng2SearchPipeModule,
    DataTableModule

  ],
  declarations: [FaqComponent, AddComponent, EditComponent],
  providers:[
    FaqService
  ]
})
export class FaqModule { }
