import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewComponent } from './view/view.component';
import { EventComponent } from './event.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Events'
    },
    children: [
      {
        path: '',
        component: EventComponent,
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
        path: 'reports/:id',
        component: ReportsComponent,
        data: {
          title: 'Abuse reports'
        }
      },
      {
        path: 'view/:id',
        component: ViewComponent,
        data: {
          title: 'View Details'
        }
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class EventRoutingModule {}
