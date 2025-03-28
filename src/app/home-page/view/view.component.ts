import { Component, inject } from '@angular/core';
import { HomePageService } from '../../home-page.service';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { json } from '@angular-devkit/core';



@Component({
  selector: 'app-view',
  standalone: false,
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class HomeViewComponent {
  homePageService = inject(HomePageService);
  latestGamesList: any[] = []; // Array to store the latest games
  username = localStorage.getItem('username');
  leaderboard: any[] = [];
  

  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
   

    this.checkUsername();
    // Subscribe to the latestGames observable
    this.homePageService.getMatchHistory().subscribe({
      next: (games) => {
        this.latestGamesList = games.data; // Store the emitted data
      },
      error: (err) => {
        console.error('Error fetching latest games:', err);
      },
    });

    this.homePageService.getLeaderboard().subscribe({
      next: (users) => {
        this.leaderboard = users.data;
      },
      error: (err) => {
        console.error('Error fetching leaderboard:', err);
      },
    });
  }
  /*[
    { points: 100, location: 'New York, USA', timeSpent: '5 mins' },
    { points: 90, location: 'London, UK', timeSpent: '4 mins' },
    { points: 80, location: 'Paris, France', timeSpent: '6 mins' },
    { points: 70, location: 'Berlin, Germany', timeSpent: '7 mins' },
    { points: 60, location: 'Tokyo, Japan', timeSpent: '8 mins' }
  ]; */

  checkUsername() {
    if (!this.username) {
      this.username = 'Guest';
    }
  }
  logout(): void {
    // Clear localStorage
    localStorage.clear();

    // Refresh the page
    window.location.reload();
  }

  
}
