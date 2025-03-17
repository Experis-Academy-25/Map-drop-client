import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login-page/login/login.component';
import { SignupComponent } from './sign-up-page/add/add.component';
import { HomeViewComponent } from './home-page/view/view.component';
import { GameViewComponent } from './game-page/view/view.component';




const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeViewComponent },
  { path: 'game', component: GameViewComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
