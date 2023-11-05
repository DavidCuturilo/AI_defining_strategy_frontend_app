import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { StrategyComponent } from './strategy/strategy.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { AlreadyLoggedGuard } from './auth/already-logged.guard';
import { AuthGuard } from './auth/auth.guard';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full',redirectTo: 'login' },
  { path: 'login', component: LoginComponent, canActivate: [AlreadyLoggedGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AlreadyLoggedGuard] },
  { path: 'chat', component: ChatComponent },
  { path: 'strategy', component: StrategyComponent },
  { path: 'tactics', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'information', component: ProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AlreadyLoggedGuard, AuthGuard]
})
export class AppRoutingModule { }
