
/*
 * Angular specific and system types of imports.
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*
 * Angular Material imports.
 */
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

/*
 * Application specific imports.
 */
import { AppComponent } from './app.component';
import { MarkdownPipe } from './services/markdown.pipe';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './services/auth.interceptor';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FeedComponent } from './components/feed/feed.component';
import { PostComponent } from './components/post/post.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    LoginComponent,
    ToolbarComponent,
    PostComponent,
    MarkdownPipe,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
