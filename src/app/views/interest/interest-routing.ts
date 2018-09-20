import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { ListComponent } from "./list/list.component";
import { InterestComponent } from './interest.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Interest'
    },
    children: [
      {
        path: '',
        component: InterestComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: AddComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'edit/:id',
        component: EditComponent,
        data: {
          title: 'Edit'
        }
      },
      {
        path: 'view/:id',
        component: ViewComponent,
        data: {
          title: 'View'
        }
      }     
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class InterestRoutingModule {}
