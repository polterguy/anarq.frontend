
// Angular imports.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Application specific imports.
import { FeedComponent } from './components/feed/feed.component';
import { PostComponent } from './components/post/post.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { CreateComponent } from './components/create/create.component';
import { DonateComponent } from './components/donate/donate.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', component: FeedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create', component: CreateComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'donate', component: DonateComponent },
  { path: 'users/:user', component: UserComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
