import { Component } from '@angular/core';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { environment } from '../environments/environment.development';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private sharedService: SharedService){}
  title = 'Map-drop-client';
 
  ngOnInit(): void {
    this.sharedService.initializeModel('gemini-2.0-flash'); // Call the method during initialization
  }
 
}
