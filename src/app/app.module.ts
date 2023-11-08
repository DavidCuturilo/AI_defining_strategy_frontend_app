import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { EnvServiceProvider } from './config/env.service.provider';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { StrategyComponent } from './strategy/strategy.component';
import { ToastrModule } from 'ngx-toastr';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { SavedTacticsComponent } from './saved-tactics/saved-tactics.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    StrategyComponent,
    ChatComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    SavedTacticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    EnvServiceProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
