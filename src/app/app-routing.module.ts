/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

// Angular core imports.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importing components, first "global/common" components.
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { SecurityComponent } from './components/security/security.component';

// Then importing all "entity components". Basically, the datagrids for viewing entities from your backend.
import { Case_typesComponent } from './components/case_types/case_types.component';
import { CasesComponent } from './components/cases/cases.component';
import { Email_typesComponent } from './components/email_types/email_types.component';
import { EmailsComponent } from './components/emails/emails.component';
import { LanguagesComponent } from './components/languages/languages.component';
import { Pgp_key_typesComponent } from './components/pgp_key_types/pgp_key_types.component';
import { Pgp_keysComponent } from './components/pgp_keys/pgp_keys.component';
import { RegionsComponent } from './components/regions/regions.component';
import { RolesComponent } from './components/roles/roles.component';
import { TranslationsComponent } from './components/translations/translations.component';
import { User_statusComponent } from './components/user_status/user_status.component';
import { Users_extra_typesComponent } from './components/users_extra_types/users_extra_types.component';
import { Users_extraComponent } from './components/users_extra/users_extra.component';
import { Users_kyc_documentsComponent } from './components/users_kyc_documents/users_kyc_documents.component';
import { UsersComponent } from './components/users/users.component';
import { VotesComponent } from './components/votes/votes.component';


// Creating our routes, one route for each entity type.
const routes: Routes = [

  // First common/global routes.
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'security', component: SecurityComponent },

  // Then routes for all entity components.
  { path: 'case_types', component: Case_typesComponent },
  { path: 'cases', component: CasesComponent },
  { path: 'email_types', component: Email_typesComponent },
  { path: 'emails', component: EmailsComponent },
  { path: 'languages', component: LanguagesComponent },
  { path: 'pgp_key_types', component: Pgp_key_typesComponent },
  { path: 'pgp_keys', component: Pgp_keysComponent },
  { path: 'regions', component: RegionsComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'translations', component: TranslationsComponent },
  { path: 'user_status', component: User_statusComponent },
  { path: 'users_extra_types', component: Users_extra_typesComponent },
  { path: 'users_extra', component: Users_extraComponent },
  { path: 'users_kyc_documents', component: Users_kyc_documentsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'votes', component: VotesComponent },
];

// Declaring our main module.
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
