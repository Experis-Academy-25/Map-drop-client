import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '../../../environments/environment.development';
import { SharedService } from '../../shared.service';

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

  position: any;
  radius: number = 1000;

  hints: { text: string }[] = [];

  //nytt
  sharedService = inject(SharedService);
  prompt: string =
    'Only give me decimal degree coordinates anywhere in the world that has google street view and is on a street and also somewhere you have not already given me. Feel free to also give coordinates for smaller, more unknown countries. Give me 10 hints about the area the coordinates are located, the hints can not include the name of the country or city. The hints shall decrease in difficulty, the first hint should be the hardest. The output should have this structure: { Latitude: , Longitude: , Hint1: , Hint2: , Hint3: , Hint4: , Hint5: , Hint6: , Hint7: , Hint8: , Hint9: , Hint10: }, both the key and value should be in double quotation marks. Only give me 1 set of coordinates and hints at a time.';
  output: string = '';

  async ngOnInit(): Promise<void> {
    const result = await this.sharedService
      .initializeModel('gemini-2.0-flash')
      .generateContent(this.prompt);

    const response = await result.response;
    this.output = response.text();
    console.log(this.output);

    const jsonObject = this.getJSONfromOutput();
    if (jsonObject) {
      console.log('Parsed JSON Object:', jsonObject);
    }

    this.position = { lat: parseFloat(jsonObject.Latitude), lng: parseFloat(jsonObject.Longitude) };
    console.log('Position:', this.position);
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
  }

  getJSONfromOutput() {
    try {
      // Use a regular expression to extract the JSON part of the string
      const jsonMatch = this.output.match(/\{[\s\S]*\}/); // Matches everything between the first and last curly brackets
      console.log('JSON Match:', jsonMatch);

      if (jsonMatch) {
        // Parse the extracted JSON string into a JavaScript object
        const jsonObject = JSON.parse(jsonMatch[0]);
        console.log('Extracted JSON:', jsonObject);
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

  constructor(private router: Router) {
   
  }

  initStreetView(): void {
    let panorama: any;
    console.log('inside initmap' + this.position.lat + ' ' + this.position.lng);
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
        
        
        panorama.setPosition(this.position, this.radius);
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
