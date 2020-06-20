/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

// Common imports from Angular ++.
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular material imports.
import { MatDialogModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Helper library/components imports.
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from 'ng-pick-datetime-moment';
import { ChartsModule } from 'ng2-charts';
import { JwtModule } from '@auth0/angular-jwt';
import { QRCodeModule } from 'angularx-qrcode';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import {
  RecaptchaModule,
  RECAPTCHA_SETTINGS,
  RecaptchaSettings
} from 'ng-recaptcha';
import { RECAPTCHA_LANGUAGE } from 'ng-recaptcha';

// Importing routing, services, pipes, etc.
import { DateToPipe } from './pipes/date-to.pipe';
import { MarkdownPipe } from './pipes/markdown.pipe';
import { DateFromPipe } from './pipes/date-from.pipe';
import { AppRoutingModule } from './app-routing.module';
import { LoaderService } from './services/loader.service';
import { MessageService } from './services/message.service';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { environment } from 'src/environments/environment';
import { LoaderInterceptor } from './services/loader.interceptor';
import { DateFormatShortPipe } from './pipes/date-format-short.pipe';

// Custom components.
import { LoginComponent } from './modals/login.component';
import { AppComponent } from './components/app/app.component';
import { AskComponent } from './components/ask/ask.component';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/private/auth/auth.component';
import { RegionComponent } from './components/region/region.component';
import { RegisterComponent } from './components/register/register.component';
import { AuditVoteComponent } from './components/audit-vote/audit-vote.component';
import { EditUserDialogComponent } from './components/private/auth/modals/edit-user-dialog';
import { CreateRoleDialogComponent } from './components/private/auth/modals/create-role-dialog';
import { CreateUserDialogComponent } from './components/private/auth/modals/create-user-dialog';

/*
 * CRUD wrapper components, both for the datagrid, and its associated editor/creator dialog.
 * These are the automatically generated CRUD endpoints components, that is generated from Magic,
 * during the scaffolding process.
 */
import { CaseComponent } from './components/case/case.component';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/user/user.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { CasesComponent } from './components/private/cases/cases.component';
import { RegionsComponent } from './components/private/regions/regions.component';
import { LanguagesComponent } from './components/private/languages/languages.component';
import { Case_typesComponent } from './components/private/case_types/case_types.component';
import { EditCasesComponent } from './components/private/cases/modals/edit.cases.component';
import { User_statusComponent } from './components/private/user_status/user_status.component';
import { Users_extraComponent } from './components/private/users_extra/users_extra.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { TranslationsComponent } from './components/private/translations/translations.component';
import { EditRegionsComponent } from './components/private/regions/modals/edit.regions.component';
import { SetupRegionsComponent } from './components/setup-regions/setup-regions.component';
import { Users_regionsComponent } from './components/private/users_regions/users_regions.component';
import { EditLanguagesComponent } from './components/private/languages/modals/edit.languages.component';
import { EditCase_typesComponent } from './components/private/case_types/modals/edit.case_types.component';
import { EditUser_statusComponent } from './components/private/user_status/modals/edit.user_status.component';
import { Users_extra_typesComponent } from './components/private/users_extra_types/users_extra_types.component';
import { EditTranslationsComponent } from './components/private/translations/modals/edit.translations.component';
import { EditUsers_regionsComponent } from './components/private/users_regions/modals/edit.users_regions.component';
import { EditUsers_extra_typesComponent } from './components/private/users_extra_types/modals/edit.users_extra_types.component';
import { EditUsers_extraComponent } from './components/private/users_extra/modals/edit.users_extra.component';


// Helper to retrieve JWT token. Needed for "oauth0".
export function tokenGetter() {
  return localStorage.getItem('jwt_token');
}

// Your main Angular module.
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AskComponent,
    LoginComponent,
    RegisterComponent,
    AuditVoteComponent,
    AuthComponent,
    CreateRoleDialogComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    DateFormatPipe,
    DateFormatShortPipe,
    DateFromPipe,
    DateToPipe,
    MarkdownPipe,
    Case_typesComponent,
    EditCase_typesComponent,
    CasesComponent,
    CaseComponent,
    UsersComponent,
    UserComponent,
    ResetPasswordComponent,
    VerifyEmailComponent,
    SetupRegionsComponent,
    EditCasesComponent,
    LanguagesComponent,
    EditLanguagesComponent,
    RegionsComponent,
    EditRegionsComponent,
    TranslationsComponent,
    EditTranslationsComponent,
    User_statusComponent,
    EditUser_statusComponent,
    Users_regionsComponent,
    EditUsers_regionsComponent,
    Users_extra_typesComponent,
    EditUsers_extra_typesComponent,
    Users_extraComponent,
    EditUsers_extraComponent,
    RegionComponent,
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
        whitelistedDomains: [
          'localhost:55247',
          'anarq.azurewebsites.net',
          'api.anarq.org'
        ],
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
    MatTooltipModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatMomentDateModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ChartsModule,
    CodemirrorModule,
    RecaptchaModule,
    QRCodeModule,
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
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6Lf45KUZAAAAANEJqSIWprWAYofIAdDunxysuaaG',
      } as RecaptchaSettings,
    },
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'no', // Use Norwegian language
    },
    MessageService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LoginComponent,
    CreateRoleDialogComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    EditCase_typesComponent,
    EditCasesComponent,
    EditLanguagesComponent,
    EditRegionsComponent,
    EditTranslationsComponent,
    EditUser_statusComponent,
    EditUsers_regionsComponent,
    EditUsers_extra_typesComponent,
    EditUsers_extraComponent,
  ]
})
export class AppModule { }
