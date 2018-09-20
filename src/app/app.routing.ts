import { NgModule } from '@angular/core';
import { CanActivate, Routes, RouterModule } from '@angular/router';
// Import Containers
import {
  FullLayout,
  SimpleLayout
} from './containers';

import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule',
      },
      {
        path: 'charts',
        loadChildren: './views/chartjs/chartjs.module#ChartJSModule'
      }
    ]
  },
  {
    path: 'customers',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/customers/customers.module#CustomersModule'
      }
    ]
  },
  {
    path: 'cms',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/cms/cms.module#CmsModule'
      }
    ]
  },
  {
    path: 'faq',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/faq/faq.module#FaqModule'
      }
    ]
  },
  {
    path: 'interest',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/interest/interest.module#InterestModule'
      }
    ]
  },
  {
    path: 'word',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/word/word.module#WordModule'
      }
    ]
  },
  {
    path: 'emailtemplate',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/emailtemplate/emailtemplate.module#EmailtemplateModule'
      }
    ]
  },
  {
    path: 'pushnotification',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/pushnotification/pushnotification.module#PushnotificationModule'
      }
    ]
  },
  {
    path: 'community',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/community/community.module#CommunityModule'
      }
    ]
  },
  {
    path: 'group',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/group/group.module#GroupModule'
      }
    ]
  },
  {
    path: 'events',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/events/event.module#EventModule'
      }
    ]
  },
  {
    path: 'report',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/report/report.module#ReportModule'
      }
    ]
  },
  {
    path: 'reporting',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/reporting/reporting.module#ReportingModule'
      }
    ]
  },
  {
    path: 'notification',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/notification/notification.module#NotificationModule'
      }
    ]
  },
  {
    path: 'setting',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/settings/settings.module#SettingsModule',
      }
    ]
  },
  {
    path: 'slider',
    component: FullLayout,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './views/intro-sliders/intro-sliders.module#IntroSlidersModule',
      }
    ]
  },
  {
    path: 'pages',
    component: SimpleLayout,
    data: {
      title: 'Pages'
    },
    children: [
      {
        path: '',
        loadChildren: './views/pages/pages.module#PagesModule',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
