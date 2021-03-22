
// Angular imports.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Application specific imports.
import { MeComponent } from './components/me/me.component';
import { FeedComponent } from './components/feed/feed.component';
import { PostComponent } from './components/post/post.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { CreateComponent } from './components/create/create.component';
import { DonateComponent } from './components/donate/donate.component';
import { RegisterComponent } from './components/register/register.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';

const routes: Routes = [
  { path: '', component: FeedComponent },
  { path: 'me', component: MeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'create', component: CreateComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'edit/:id', component: CreateComponent },
  { path: 'donate', component: DonateComponent },
  { path: 'user/:user', component: UserComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'all-users', component: AllUsersComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
