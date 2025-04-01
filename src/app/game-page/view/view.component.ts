import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '../../../environments/environment.development';
import { SharedService } from '../../shared.service';

import { countries } from '../../../countries';

import { GamePageService } from '../../game-page.service';

@Component({
  selector: 'app-view',
  standalone: false,
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class GameViewComponent {
  gamePageService = inject(GamePageService);
  hintPoints: number = 10; // Example hintPoints value
  currentHintIndex: number = 0;
  score: number = 0; // Example score value
  maxViewedHintIndex: number = 0; // Track the highest hint index viewed

  showModal: boolean = false; // Control the visibility of the modal
  showResultsModal: boolean = false;

  loader = new Loader({
    apiKey: environment.api_key,
    version: 'weekly',
  });

  marker: any; // The guess marker
  panorama: any;
  sv: any;
  position: any;
  gameId: any;

  radius: number = 2000000;
  country: string = countries[Math.floor(Math.random() * countries.length)];

  distance = -1; // Temp. distance (if -1 is displayed, something went wrong)

  hints: { text: string }[] = [];

  //nytt
  sharedService = inject(SharedService);
  prompt: string =
    'Give me decimal degree coordinates and 10 hints about that area, following these constraints: - Must be inside ' +
    this.country +
    '. - Must have google street view available. - Must not be located in the same country as earlier ones. - The hints must not mention ' +
    this.country +
    " or the city it's in. - The decimal degree coorinated must be on land. - The hints should be ordered by difficulty from hardest to easiest 1-10. - The structure must be in this structure: { Latitude: , Longitude: , Country: , Hint1: , Hint2: , Hint3: , Hint4: , Hint5: , Hint6: , Hint7: , Hint8: , Hint9: , Hint10: }, both the key and value should be in double quotation marks. Only give me 1 set of coordinates and hints at a time.";
  output: string = '';

  async ngOnInit(): Promise<void> {
    const result = await this.sharedService
      .initializeModel('gemini-2.0-flash')
      .generateContent(this.prompt);

    const response = await result.response;
    this.output = response.text();

    const jsonObject = this.getJSONfromOutput();

    this.position = {
      lat: parseFloat(jsonObject.Latitude),
      lng: parseFloat(jsonObject.Longitude),
    };

    this.hints = [
      { text: jsonObject.Hint1 },
      { text: jsonObject.Hint2 },
      { text: jsonObject.Hint3 },
      { text: jsonObject.Hint4 },
      { text: jsonObject.Hint5 },
      { text: jsonObject.Hint6 },
      { text: jsonObject.Hint7 },
      { text: jsonObject.Hint8 },
      { text: jsonObject.Hint9 },
      { text: jsonObject.Hint10 },
    ];

    this.initStreetView();
    this.initMap();

    this.gamePageService
      .createGame({
        points: 0,
        distance: 0,
        location: "Abandoned",
        longitude_guess: 0,
        latitude_guess: 0,
        longitude_real: 0,
        latitude_real: 0,
      })
      .subscribe({
        next: (response: any) => {
          this.gameId = response.data.id; // Store the game ID for later use
          console.log('Game created with ID:', this.gameId);
          console.log(response);
        },
        error: (error) => console.log(error),
      });
  }

  async initializePanorama(): Promise<void> {
    return await this.loader.importLibrary('streetView').then(() => {
      if (!this.panorama) {
        this.panorama = new google.maps.StreetViewPanorama(
          document.getElementById('streetview') as HTMLElement,
          {
            addressControl: false,
            fullscreenControl: false,
            showRoadLabels: false,
            imageDateControl: false,
            panControl: false,
            linksControl: false,
            clickToGo: false,
          }
        );
        this.sv = new google.maps.StreetViewService();
      }
    });
  }

  getJSONfromOutput() {
    try {
      // Use a regular expression to extract the JSON part of the string
      const jsonMatch = this.output.match(/\{[\s\S]*\}/); // Matches everything between the first and last curly brackets

      if (jsonMatch) {
        // Parse the extracted JSON string into a JavaScript object
        const jsonObject = JSON.parse(jsonMatch[0]);

        return jsonObject; // Return the JSON object
      } else {
        console.error('No JSON object found in the output string.');
        return null;
      }
    } catch (error) {
      console.error('Error parsing JSON from output:', error);
      return null;
    }
  }

  //nytt

  constructor(private router: Router) {}

  async initStreetView(): Promise<void> {
    await this.initializePanorama(); // Ensure the panorama is initialized

    this.sv
      .getPanorama({
        location: this.position,
        radius: this.radius,
        preference: 'nearest',
      })
      .then(this.processSVData.bind(this));
  }

  async processSVData({ data }: google.maps.StreetViewResponse) {
    await this.initializePanorama(); // Ensure the panorama is initialized

    const location = data.location!;

    this.panorama.setPano(location.pano as string); // Set the panorama ID
    this.panorama.setPov({
      heading: 270,
      pitch: 0,
    });
    this.panorama.setVisible(true);
  }

  initMap(): void {
    let map: any;

    this.loader
      .importLibrary('maps')
      .then(({ Map }) => {
        map = new Map(document.getElementById('map') as HTMLElement, {
          center: { lat: 0, lng: 0 },
          zoom: 1.8,
          mapTypeControl: false,
          streetViewControl: false,
          mapId: 'marker_map',
          restriction: {
            latLngBounds: new google.maps.LatLngBounds({
              north: 85,
              south: -85,
              west: -179.9,
              east: 179.9,
            }),
            strictBounds: true,
          },
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
    this.loader.importLibrary('maps').then(({ Map }) => {
      map = new Map(document.getElementById('results-map') as HTMLElement, {
        center: this.position,
        zoom: 1.5,
        mapTypeControl: false,
        streetViewControl: false,
        mapId: 'results_map',
        restriction: {
          latLngBounds: new google.maps.LatLngBounds({
            north: 85,
            south: -85,
            west: -179.9,
            east: 179.9,
          }),
          strictBounds: true,
        },
      });

      this.loader
        .importLibrary('marker')
        .then(({ AdvancedMarkerElement, PinElement }) => {
          new AdvancedMarkerElement({
            map: map,
            position: this.marker.position,
          });
          new AdvancedMarkerElement({
            map: map,
            position: this.position,
            content: new PinElement({
              background: 'green',
              glyphColor: 'white',
              borderColor: 'green',
            }).element,
          });
        });
      if (
        this.position.lng > this.marker.position.lng ||
        this.marker.position.lng > 180 - this.position.lng
      ) {
        map.fitBounds(
          new google.maps.LatLngBounds(this.marker.position, this.position),
          40
        );
      } else {
        map.fitBounds(
          new google.maps.LatLngBounds(this.position, this.marker.position),
          40
        );
      }
    });
  }

  placeMarker(latLng: google.maps.LatLng) {
    this.marker.position = latLng;
  }

  markerIsPlaced() {
    return this.marker && this.marker.position != null;
  }

  calculatePointsAndDistance() {
    if (this.markerIsPlaced()) {
      const positionLatLng = new google.maps.LatLng(
        this.position.lat,
        this.position.lng
      );

      this.distance =
        Math.round(
          (google.maps.geometry.spherical.computeDistanceBetween(
            this.marker.position,
            positionLatLng
          ) /
            1000) *
            100
        ) / 100; // Display in km
      this.calculatePoints();
    }
  }

  calculatePoints() {
    this.score =
      Math.round(
        (this.hintPoints / 5) *
          100 *
          Math.exp((-10 * this.distance) / 20000) *
          1
      ) /
        1 -
      50;
  }

  submitGuess() {
    this.showResultsModal = true;
    this.calculatePointsAndDistance();
    this.initResultsMap();
    const modal = document.getElementById('results-modal') as HTMLElement;
    modal.style.zIndex = '1';
    this.gamePageService
      .updateGame(this.gameId, {
        points: this.score,
        distance: this.distance,
        location: this.country,
        longitude_guess: this.marker.position.lng,
        latitude_guess: this.marker.position.lat,
        longitude_real: this.position.lng,
        latitude_real: this.position.lat,
      })
      .subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (error) => console.log(error),
      });
  }

  nextHint() {
    if (this.currentHintIndex < this.hints.length - 1) {
      this.currentHintIndex++;
      if (this.currentHintIndex > this.maxViewedHintIndex) {
        this.maxViewedHintIndex = this.currentHintIndex;
        this.hintPoints--; // Deduct hintPoints for viewing a new hint
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
