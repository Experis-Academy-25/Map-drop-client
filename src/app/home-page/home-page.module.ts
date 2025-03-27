import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeViewComponent } from './view/view.component';
import { AppComponent } from '../app.component';



@NgModule({
  declarations: [
    HomeViewComponent
  ],
  imports: [
    CommonModule,
    AppComponent
  ]
})
export class HomePageModule { }
