import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailtemplateRoutingModule } from './emailtemplate-routing';
import { EmailtemplateComponent } from './emailtemplate.component';
import { EmailtemplateService } from '../../services/emailtemplate.service';

import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
// import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { TinymceModule } from 'angular2-tinymce';
import { absEnvironment } from '../../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    EmailtemplateRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TinymceModule.withConfig({
      skin_url: absEnvironment.absuluteUrl
    })
    // ,
    // FroalaEditorModule.forRoot(),
    // FroalaViewModule.forRoot()

  ],
  declarations: [EmailtemplateComponent, AddComponent, EditComponent],
  providers:[
    EmailtemplateService
  ]
})
export class EmailtemplateModule { }
