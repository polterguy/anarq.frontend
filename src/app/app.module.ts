/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

 // Common imports from Angular ++.
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material imports.
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from 'ng-pick-datetime-moment';
import { ChartsModule } from 'ng2-charts';

// Importing "oauth0" to help out with our JWT tokens.
import { JwtModule } from '@auth0/angular-jwt';

// CodeMirror includes
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

// Routing, services, etc imports.
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './services/loader.interceptor';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { DateFromPipe } from './pipes/date-from.pipe';
import { DateToPipe } from './pipes/date-to.pipe';
import { MarkdownPipe } from './pipes/markdown.pipe';
import { environment } from 'src/environments/environment';

// All components. First all "global" components.
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './modals/login.component';
import { AuthComponent } from './components/auth/auth.component';
import { CreateRoleDialogComponent } from './components/auth/modals/create-role-dialog';
import { CreateUserDialogComponent } from './components/auth/modals/create-user-dialog';
import { EditUserDialogComponent } from './components/auth/modals/edit-user-dialog';

// CRUD wrapper components, both for the datagrid, and its associated editor/creator dialog.
import { Case_typesComponent } from './components/case_types/case_types.component';
import { EditCase_typesComponent } from './components/case_types/modals/edit.case_types.component';
import { CasesComponent } from './components/cases/cases.component';
import { CaseComponent } from './components/case/case.component';
import { EditCasesComponent } from './components/cases/modals/edit.cases.component';
import { Email_typesComponent } from './components/email_types/email_types.component';
import { EditEmail_typesComponent } from './components/email_types/modals/edit.email_types.component';
import { EmailsComponent } from './components/emails/emails.component';
import { EditEmailsComponent } from './components/emails/modals/edit.emails.component';
import { LanguagesComponent } from './components/languages/languages.component';
import { EditLanguagesComponent } from './components/languages/modals/edit.languages.component';
import { Pgp_key_typesComponent } from './components/pgp_key_types/pgp_key_types.component';
import { EditPgp_key_typesComponent } from './components/pgp_key_types/modals/edit.pgp_key_types.component';
import { Pgp_keysComponent } from './components/pgp_keys/pgp_keys.component';
import { EditPgp_keysComponent } from './components/pgp_keys/modals/edit.pgp_keys.component';
import { RegionsComponent } from './components/regions/regions.component';
import { EditRegionsComponent } from './components/regions/modals/edit.regions.component';
import { TranslationsComponent } from './components/translations/translations.component';
import { EditTranslationsComponent } from './components/translations/modals/edit.translations.component';
import { User_statusComponent } from './components/user_status/user_status.component';
import { EditUser_statusComponent } from './components/user_status/modals/edit.user_status.component';
import { Users_extra_typesComponent } from './components/users_extra_types/users_extra_types.component';
import { EditUsers_extra_typesComponent } from './components/users_extra_types/modals/edit.users_extra_types.component';
import { Users_extraComponent } from './components/users_extra/users_extra.component';
import { EditUsers_extraComponent } from './components/users_extra/modals/edit.users_extra.component';
import { Users_kyc_documentsComponent } from './components/users_kyc_documents/users_kyc_documents.component';
import { EditUsers_kyc_documentsComponent } from './components/users_kyc_documents/modals/edit.users_kyc_documents.component';
import { VotesComponent } from './components/votes/votes.component';
import { EditVotesComponent } from './components/votes/modals/edit.votes.component';


// Helper to retrieve JWT token. Needed for "oauth0".
export function tokenGetter() {
  return localStorage.getItem('jwt_token');
}

// Your main Angular module.
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AuthComponent,
    CreateRoleDialogComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    DateFormatPipe,
    DateFromPipe,
    DateToPipe,
    MarkdownPipe,
    Case_typesComponent,
    EditCase_typesComponent,
    CasesComponent,
    CaseComponent,
    EditCasesComponent,
    Email_typesComponent,
    EditEmail_typesComponent,
    EmailsComponent,
    EditEmailsComponent,
    LanguagesComponent,
    EditLanguagesComponent,
    Pgp_key_typesComponent,
    EditPgp_key_typesComponent,
    Pgp_keysComponent,
    EditPgp_keysComponent,
    RegionsComponent,
    EditRegionsComponent,
    TranslationsComponent,
    EditTranslationsComponent,
    User_statusComponent,
    EditUser_statusComponent,
    Users_extra_typesComponent,
    EditUsers_extra_typesComponent,
    Users_extraComponent,
    EditUsers_extraComponent,
    Users_kyc_documentsComponent,
    EditUsers_kyc_documentsComponent,
    VotesComponent,
    EditVotesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: [environment.apiDomain],
      }
    }),
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatMomentDateModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ChartsModule,
    CodemirrorModule,
  ],
  providers: [
    LoaderService, {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    {
      provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS,
      useValue: { useUtc: true }
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LoginComponent,
    CreateRoleDialogComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    EditCase_typesComponent,
    EditCasesComponent,
    EditEmail_typesComponent,
    EditEmailsComponent,
    EditLanguagesComponent,
    EditPgp_key_typesComponent,
    EditPgp_keysComponent,
    EditRegionsComponent,
    EditTranslationsComponent,
    EditUser_statusComponent,
    EditUsers_extra_typesComponent,
    EditUsers_extraComponent,
    EditUsers_kyc_documentsComponent,
    EditVotesComponent,
  ]
})
export class AppModule { }
