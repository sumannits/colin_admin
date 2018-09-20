import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomersComponent } from './customers.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ReportsComponent } from './reports/reports.component';
import { ViewComponent } from './view/view.component';
import { AllcustomerComponent } from './allcustomer/allcustomer.component';

const routes: Routes = [
  {
    path: '',
    data: {
      //title: 'Customer'
      title: 'Users'
    },
    children: [
      {
        path: '',
        component: CustomersComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'all',
        component: AllcustomerComponent,
        data: {
          title: 'All Customer'
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
          title: 'View'
        }
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CustomersRoutingModule {}
