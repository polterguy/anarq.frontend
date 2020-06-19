/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

// Angular core imports.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importing components, first "global/common" components.
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/private/auth/auth.component';

// Then importing all "entity components". Basically, the datagrids for viewing entities from your backend.
import { Case_typesComponent } from './components/private/case_types/case_types.component';
import { CasesComponent } from './components/private/cases/cases.component';
import { LanguagesComponent } from './components/private/languages/languages.component';
import { RegionsComponent } from './components/private/regions/regions.component';
import { TranslationsComponent } from './components/private/translations/translations.component';
import { User_statusComponent } from './components/private/user_status/user_status.component';
import { Users_regionsComponent } from './components/private/users_regions/users_regions.component';
import { Users_extra_typesComponent } from './components/private/users_extra_types/users_extra_types.component';
import { Users_extraComponent } from './components/private/users_extra/users_extra.component';
import { VotesComponent } from './components/private/votes/votes.component';
import { CaseComponent } from './components/case/case.component';
import { UserComponent } from './components/user/user.component';
import { RegionComponent } from './components/region/region.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { SetupRegionsComponent } from './components/setup-regions/setup-regions.component';
import { AskComponent } from './components/ask/ask.component';
import { AuditVoteComponent } from './components/audit-vote/audit-vote.component';
import { UsersComponent } from './components/users/users.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';


// Creating our routes, one route for each entity type.
const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'ask/:region', component: AskComponent },
  { path: 'reset-password/:username/:hash', component: ResetPasswordComponent },
  { path: 'audit-vote/:hash', component: AuditVoteComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email/:username/:hash', component: VerifyEmailComponent },
  { path: 'setup-regions', component: SetupRegionsComponent },
  { path: 'case/:id', component: CaseComponent },
  { path: 'users', component: UsersComponent },
  { path: 'user/:username', component: UserComponent },
  { path: 'region/:region', component: RegionComponent },
  { path: 'case_types', component: Case_typesComponent },
  { path: 'cases', component: CasesComponent },
  { path: 'languages', component: LanguagesComponent },
  { path: 'regions', component: RegionsComponent },
  { path: 'translations', component: TranslationsComponent },
  { path: 'user_status', component: User_statusComponent },
  { path: 'users_extra_types', component: Users_extra_typesComponent },
  { path: 'users_regions', component: Users_regionsComponent },
  { path: 'users_extra', component: Users_extraComponent },
  { path: 'votes', component: VotesComponent },
];

// Declaring our main module.
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
