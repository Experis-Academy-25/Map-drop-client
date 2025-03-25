import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-view',
  standalone: false,
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class GameViewComponent {
  points: number = 10; // Example points value
  currentHintIndex: number = 0;
  maxViewedHintIndex: number = 0; // Track the highest hint index viewed
  condition: boolean = true; // Example condition
  showModal: boolean = false; // Control the visibility of the modal
  showResultsModal: boolean = false;

  loader = new Loader({
    apiKey: environment.api_key,
    version: 'weekly',
  });

  marker: any;

  position = { lat: 40.4168, lng: -3.7038 };

  hints: { text: string; link: string }[] = [
    { text: 'Hint 1', link: 'https://example.com/hint1' },
    { text: 'Hint 2', link: 'https://example.com/hint2' },
    { text: 'Hint 3', link: 'https://example.com/hint3' },
    { text: 'Hint 4', link: 'https://example.com/hint4' },
    { text: 'Hint 5', link: 'https://example.com/hint5' },
    { text: 'Hint 6', link: 'https://example.com/hint6' },
    { text: 'Hint 7', link: 'https://example.com/hint7' },
    { text: 'Hint 8', link: 'https://example.com/hint8' },
    { text: 'Hint 9', link: 'https://example.com/hint9' },
    { text: 'Hint 10', link: 'https://example.com/hint10' },
  ];

  constructor(private router: Router) {
    this.initStreetView();
    this.initMap();
  }

  initStreetView(): void {
    let panorama: any;

    this.loader
      .importLibrary('streetView')
      .then(({ StreetViewPanorama }) => {
        panorama = new StreetViewPanorama(
          document.getElementById('streetview') as HTMLElement,
          {
            position: this.position,
            zoom: 18,
            addressControl: false,
          }
        );

        panorama.setPosition(this.position);
        panorama.setPov(
          /** @type {google.maps.StreetViewPov} */ {
            heading: 265,
            pitch: 0,
          }
        );
        panorama.setVisible(true);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  initMap(): void {
    let map: any;

    this.loader
      .importLibrary('maps')
      .then(({ Map }) => {
        map = new Map(document.getElementById('map') as HTMLElement, {
          center: this.position,
          zoom: 1.5,
          mapTypeControl: false,
          streetViewControl: false,
          mapId: 'marker_map',
        });

        this.loader
          .importLibrary('marker')
          .then(({ AdvancedMarkerElement }) => {
            this.marker = new AdvancedMarkerElement({ map: map });
          });
        map.addListener('click', (e: any) => {
          this.placeMarker(e.latLng);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  initResultsMap(): void {
    let map: any;

    this.loader
      .importLibrary('maps')
      .then(({ Map }) => {
        map = new Map(document.getElementById('results-map') as HTMLElement, {
          center: this.position,
          zoom: 1.5,
          mapTypeControl: false,
          streetViewControl: false,
          mapId: 'results_map',
        });

        this.loader
          .importLibrary('marker')
          .then(({ AdvancedMarkerElement }) => {
            new AdvancedMarkerElement({
              map: map,
              position: this.marker.position,
            });
            new AdvancedMarkerElement({
              map: map,
              position: this.position,
            });
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  placeMarker(latLng: google.maps.LatLng) {
    this.marker.position = latLng;
  }

  markerIsPlaced() {
    return this.marker && this.marker.position != null;
  }

  submitGuess() {
    // this.showResultsModal = true;
    this.initResultsMap();
    const modal = document.getElementById('results-modal') as HTMLElement;
    modal.style.zIndex = '1';
  }

  nextHint() {
    if (this.currentHintIndex < this.hints.length - 1) {
      this.currentHintIndex++;
      if (this.currentHintIndex > this.maxViewedHintIndex) {
        this.maxViewedHintIndex = this.currentHintIndex;
        this.points--; // Deduct points for viewing a new hint
      }
    }
  }

  previousHint() {
    if (this.currentHintIndex > 0) {
      this.currentHintIndex--;
    }
  }

  showExitConfirmation() {
    this.showModal = true;
  }

  confirmExit() {
    this.router.navigate(['/home']);
  }

  cancelExit() {
    this.showModal = false;
  }
}
