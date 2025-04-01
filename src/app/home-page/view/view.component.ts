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
  points: number = 0;
  placement: any;
  

  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
   

    this.checkUsername();

    this.homePageService.getLeaderboard().subscribe({
      next: (users) => {
        this.leaderboard = users.data;
        for (let i = 0; i < this.leaderboard.length; i++) {
          if (this.leaderboard[i].username === this.username) {
            this.placement = i + 1; // Get the index of the user in the leaderboard array
            break; // Exit the loop once the user is found
          }
          else {
            this.placement = 0; // If the user is not found, set placement to 0
          }
        }
      },
      error: (err) => {
        console.error('Error fetching leaderboard:', err);
      },
    });

    if(this.username !=="Guest"){
        // Subscribe to the latestGames observable
      this.homePageService.getMatchHistory().subscribe({
        next: (games) => {
          this.latestGamesList = games.data; // Store the emitted data
        },
        error: (err) => {
          console.error('Error fetching latest games:', err);
        },
      });

      this.homePageService.getUserPoints().subscribe({
        next: (user) => {
          this.points = user.data.totalPoints;
          
        },
        error: (err) => {
          console.error('Error fetching user points:', err);
        },
      });


      
    }
    

   

    
    
  }


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
