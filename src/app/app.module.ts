import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../services/user-service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CategoryAnalysisComponent } from '../pages/category-analysis/category-analysis.component';
import { LoginComponent } from '../pages/login/login.component';
import { SignupComponent } from '../pages/signup/signup.component';
import { CardComponent } from '../components/card/card.component';
import { LayoutComponent } from '../components/layout/layout.component';
import { TicketViewComponent } from '../pages/ticket-view/ticket-view.component';
import { SendTicketComponent } from '../pages/send-ticket/send-ticket.component';
import { MatFormField } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookiesService } from '../services/cookies-service';
import { CategoryService } from '../services/category-service';
import { TicketService } from '../services/ticket-service';
import { InstitutionService } from '../services/institution-service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { InstitutionListComponent } from '../pages/institution-list/institution-list.component';
import { CategoryListComponent } from '../pages/category-list/category-list.component';
import { TicketListComponent } from '../pages/ticket-list/ticket-list.component';
import { LocationListComponent } from '../pages/location-list/location-list.component';
import { FastSelectSendTicketComponent } from '../dialogs/fast-select-send-ticket/fast-select-send-ticket.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { UserListComponent } from '../pages/user-list/user-list.component';
import { TextDialogComponent } from '../dialogs/text-dialog/text-dialog.component';
import { UpdatePasswordComponent } from '../dialogs/update-password/update-password.component';
import { LoadingScreenComponent } from '../components/loading-screen/loading-screen.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProfileComponent } from '../dialogs/profile/profile.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
    declarations: [
        AppComponent,
        TicketListComponent,
        CategoryAnalysisComponent,
        LoginComponent,
        SignupComponent,
        CardComponent,
        LayoutComponent,
        TicketViewComponent,
        SendTicketComponent,
        CategoryListComponent,
        InstitutionListComponent,
        LocationListComponent,
        FastSelectSendTicketComponent,
        UserListComponent,
        TextDialogComponent,
        UpdatePasswordComponent,
        LoadingScreenComponent,
        ProfileComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatTableModule,
        MatDatepickerModule,
        BrowserModule,
        CommonModule,
        ReactiveFormsModule,
        RouterOutlet,
        MatFormField,
        RouterModule.forRoot(routes),
        BrowserAnimationsModule,
        MatButtonToggleModule,
        MatDialogModule,
        FormsModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatPaginatorModule
    ],
    providers: [
        UserService,
        CookiesService,
        CategoryService,
        TicketService,
        InstitutionService,
        HttpClient,
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
