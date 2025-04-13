import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { ROUTE_CONFIG } from '../config/route-config';
import { LayoutComponent } from '../components/layout/layout.component';
import { SignupComponent } from '../pages/signup/signup.component';
import { TicketViewComponent } from '../pages/ticket-view/ticket-view.component';
import { AuthGuard } from '../auth/auth-guard';
import { CategoryAnalysisComponent } from '../pages/category-analysis/category-analysis.component';
import { TicketListComponent } from '../pages/ticket-list/ticket-list.component';
import { SendTicketComponent } from '../pages/send-ticket/send-ticket.component';
import { CategoryListComponent } from '../pages/category-list/category-list.component';
import { InstitutionListComponent } from '../pages/institution-list/institution-list.component';
import { LocationListComponent } from '../pages/location-list/location-list.component';
import { UserListComponent } from '../pages/user-list/user-list.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: ROUTE_CONFIG.CATEGORY_ANALYSIS.path,
        component: CategoryAnalysisComponent,
        title: ROUTE_CONFIG.CATEGORY_ANALYSIS.titlePage,
        data: {
          sidebarTitle: ROUTE_CONFIG.CATEGORY_ANALYSIS.sidebarTitle,
          sidebar: ROUTE_CONFIG.CATEGORY_ANALYSIS.sidebar,
          claim: ROUTE_CONFIG.CATEGORY_ANALYSIS.claim
        },
        canActivate: [AuthGuard]
      },
      {
        path: ROUTE_CONFIG.TICKET_LIST.path,
        component: TicketListComponent,
        title: ROUTE_CONFIG.TICKET_LIST.titlePage,
        data: {
          sidebarTitle: ROUTE_CONFIG.TICKET_LIST.sidebarTitle,
          sidebar: ROUTE_CONFIG.TICKET_LIST.sidebar,
          claim: ROUTE_CONFIG.TICKET_LIST.claim
        },
        canActivate: [AuthGuard]
      },
      {
        path: ROUTE_CONFIG.HOME.path,
        component: SendTicketComponent,
        title: ROUTE_CONFIG.HOME.titlePage,
        data: {
          sidebarTitle: ROUTE_CONFIG.HOME.sidebarTitle,
          sidebar: ROUTE_CONFIG.HOME.sidebar,
          claim: ROUTE_CONFIG.HOME.claim
        },
        canActivate: [AuthGuard]
      },
      {
        path: ROUTE_CONFIG.SEND_FEEDBACK.path,
        component: SendTicketComponent,
        title: ROUTE_CONFIG.SEND_FEEDBACK.titlePage,
        data: {
          sidebarTitle: ROUTE_CONFIG.SEND_FEEDBACK.sidebarTitle,
          sidebar: ROUTE_CONFIG.SEND_FEEDBACK.sidebar,
          claim: ROUTE_CONFIG.SEND_FEEDBACK.claim
        },
        canActivate: [AuthGuard]
      },
      {
        path: `${ROUTE_CONFIG.TICKET_VIEW.path}/:id`,
        component: TicketViewComponent,
        title: ROUTE_CONFIG.TICKET_VIEW.titlePage,
        data: {
          sidebarTitle: ROUTE_CONFIG.TICKET_VIEW.sidebarTitle,
          sidebar: ROUTE_CONFIG.TICKET_VIEW.sidebar,
          claim: ROUTE_CONFIG.TICKET_VIEW.claim
        },
        canActivate: [AuthGuard]
      },
      {
        path: ROUTE_CONFIG.CATEGORY_LIST.path,
        component: CategoryListComponent,
        title: ROUTE_CONFIG.CATEGORY_LIST.titlePage,
        data: {
          sidebarTitle: ROUTE_CONFIG.CATEGORY_LIST.sidebarTitle,
          sidebar: ROUTE_CONFIG.CATEGORY_LIST.sidebar,
          claim: ROUTE_CONFIG.CATEGORY_LIST.claim
        },
        canActivate: [AuthGuard]
      },
      {
        path: ROUTE_CONFIG.INSTITUTION_LIST.path,
        component: InstitutionListComponent,
        title: ROUTE_CONFIG.INSTITUTION_LIST.titlePage,
        data: {
          sidebarTitle: ROUTE_CONFIG.INSTITUTION_LIST.sidebarTitle,
          sidebar: ROUTE_CONFIG.INSTITUTION_LIST.sidebar,
          claim: ROUTE_CONFIG.INSTITUTION_LIST.claim
        },
        canActivate: [AuthGuard]
      },
      {
        path: ROUTE_CONFIG.AMBIENCE_LIST.path,
        component: LocationListComponent,
        title: ROUTE_CONFIG.AMBIENCE_LIST.titlePage,
        data: {
          sidebarTitle: ROUTE_CONFIG.AMBIENCE_LIST.sidebarTitle,
          sidebar: ROUTE_CONFIG.AMBIENCE_LIST.sidebar,
          claim: ROUTE_CONFIG.AMBIENCE_LIST.claim
        },
        canActivate: [AuthGuard]
      },
      {
        path: ROUTE_CONFIG.USER_LIST.path,
        component: UserListComponent,
        title: ROUTE_CONFIG.USER_LIST.titlePage,
        data: {
          sidebarTitle: ROUTE_CONFIG.USER_LIST.sidebarTitle,
          sidebar: ROUTE_CONFIG.USER_LIST.sidebar,
          claim: ROUTE_CONFIG.USER_LIST.claim
        },
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: ROUTE_CONFIG.CATEGORY_ANALYSIS.path,
        pathMatch: 'full'
      }
    ]
  },
  // {
  //   path: ROUTE_CONFIG.LOGIN.path,
  //   component: LoginComponent,
  //   title: ROUTE_CONFIG.LOGIN.titlePage,
  //   data: {
  //     sidebarTitle: ROUTE_CONFIG.LOGIN.sidebarTitle,
  //     sidebar: ROUTE_CONFIG.LOGIN.sidebar,
  //     claim: ROUTE_CONFIG.LOGIN.claim
  //   },
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: ROUTE_CONFIG.SIGNUP.path,
  //   component: SignupComponent,
  //   title: ROUTE_CONFIG.SIGNUP.titlePage,
  //   data: {
  //     sidebarTitle: ROUTE_CONFIG.SIGNUP.sidebarTitle,
  //     sidebar: ROUTE_CONFIG.SIGNUP.sidebar,
  //     claim: ROUTE_CONFIG.SIGNUP.claim
  //   },
  //   canActivate: [AuthGuard]
  // },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
