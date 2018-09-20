import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunityComponent } from './community.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { ReportsComponent } from './reports/reports.component';
import { NodeaddComponent } from './nodeadd/nodeadd.component';
import { NodeeditComponent } from './nodeedit/nodeedit.component';
import { NodeviewComponent } from './nodeview/nodeview.component';
import { NodelistComponent } from './nodelist/nodelist.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Community'
    },
    children: [
      {
        path: '',
        component: CommunityComponent,
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
      },
      {
        path: 'reports/:id',
        component: ReportsComponent,
        data: {
          title: 'Abuse reports'
        }
      },
      {
        path: 'node_add/:id',
        component: NodeaddComponent,
        data: {
          title: 'Node Add'
        }
      },
      {
        path: 'node_list/:id',
        component: NodelistComponent,
        data: {
          title: 'Node List'
        }
      },
      {
        path: 'node_view/:id',
        component: NodeviewComponent,
        data: {
          title: 'Node View'
        }
      },
      {
        path: 'node_edit/:id',
        component: NodeeditComponent,
        data: {
          title: 'Node Edit'
        }
      }       
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CommunityRoutingModule {}
