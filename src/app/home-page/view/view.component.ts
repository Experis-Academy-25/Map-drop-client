import { Component } from '@angular/core';

@Component({
  selector: 'app-view',
  standalone: false,
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  leaderboard = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7', 'User8', 'User9', 'User10'];
  latestGames = [
    { points: 100, location: 'New York, USA', timeSpent: '5 mins' },
    { points: 90, location: 'London, UK', timeSpent: '4 mins' },
    { points: 80, location: 'Paris, France', timeSpent: '6 mins' },
    { points: 70, location: 'Berlin, Germany', timeSpent: '7 mins' },
    { points: 60, location: 'Tokyo, Japan', timeSpent: '8 mins' }
  ];
  username = 'Guest'; // Replace with actual username logic
}