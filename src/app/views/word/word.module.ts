import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordRoutingModule } from './word-routing';
import { WordComponent } from './word.component';
import { WordService } from '../../services/word.service';

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
    WordRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TinymceModule.withConfig({
      skin_url: absEnvironment.absuluteUrl
    }),
    Ng2SearchPipeModule,
    DataTableModule

  ],
  declarations: [WordComponent, AddComponent, EditComponent],
  providers:[
    WordService
  ]
})
export class WordModule { }
