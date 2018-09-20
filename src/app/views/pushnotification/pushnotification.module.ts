import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushnotificationRoutingModule } from './pushnotification-routing';
import { PushnotificationComponent } from './pushnotification.component';
import { PushnotificationService } from '../../services/pushnotification.service';

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
    PushnotificationRoutingModule,
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
  declarations: [PushnotificationComponent, AddComponent, EditComponent],
  providers:[
    PushnotificationService
  ]
})
export class PushnotificationModule { }
