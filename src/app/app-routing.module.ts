import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { StrategyComponent } from './strategy/strategy.component';

const routes: Routes = [
  { path: '', pathMatch: 'full',redirectTo: 'signIn' },
  { path: 'chat', component: MenuComponent },
  { path: 'strategy', component: StrategyComponent },
  { path: 'tactics', component: MenuComponent },
  { path: 'information', component: MenuComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
