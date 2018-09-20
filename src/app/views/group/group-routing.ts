import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { ListComponent } from "./list/list.component";
import { GroupComponent } from './group.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { AddSubgrpComponent } from './add-subgrp/add-subgrp.component';
import { EditSubgrpComponent } from './edit-subgrp/edit-subgrp.component';
import { ReportsComponent } from './reports/reports.component';
import { ChatComponent } from './chat/chat.component';
import { ViewSubgrpComponent } from "./view-subgrp/view-subgrp.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Group'
    },
    children: [
      {
        path: '',
        component: GroupComponent,
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
        path: 'view_subgroup/:id',
        component: ViewSubgrpComponent,
        data: {
          title: 'Sub Group'
        }
      },
      {
        path: 'add_sub_group/:id',
        component: AddSubgrpComponent,
        data: {
          title: 'Add Sub Group'
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
        path: 'chat/:id',
        component: ChatComponent,
        data: {
          title: 'Chat'
        }
      } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class GroupRoutingModule {}
