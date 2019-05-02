import { Component, OnInit, ViewChild, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';
import { AqiService } from '../services/aqi/aqi.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
declare var google: any;

@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.css']
})
export class CitySearchComponent implements OnInit {
  @ViewChild('citySearch')
  private citySearch: ElementRef;
  @Output() firstSearchInitiated = new EventEmitter<boolean>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() aqi = new EventEmitter<object>();
  @Output() errorMessage = new EventEmitter<string>();
  city: string;
  state: string;
  country: string;
  searchForm: FormGroup;
  autocomplete: any;
  searchComplete: boolean;


  constructor(
    private ngZone: NgZone,
    private gmaps: MapsAPILoader,
    private fb: FormBuilder,
    private aqiService: AqiService) { }

  ngOnInit() {
    this.firstSearchInitiated.emit(false);
    this.loading.emit(false);
    this.searchComplete = false;
    this.createForm();

    this.gmaps.load().then(() => {
      const autocomplete =
      new google.maps.places.Autocomplete(this.citySearch.nativeElement, {
        types: ['(cities)']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          this.autocomplete = autocomplete.getPlace();
          // If a user has selected an option from the Google autocomplete suggestions, address_components
          // will be true. If the user has typed the city and not selected a suggestion, autocomplete will
          // only have { name: typedName } and address_components will be false. Info from address_components 
          // is needed for the api to get data.
          this.parseAutocompleteData(this.autocomplete.address_components);
        });
      });
    });
  }

  getSearchedCityAqi() {
    if (this.searchComplete) {
      this.firstSearchInitiated.emit(true);
      this.loading.emit(true);
      this.aqi.emit(null);
      this.aqiService.getCityAqi(this.city, this.state, this.country).subscribe(res => {
        this.aqi.emit(res);
        this.loading.emit(false);
        this.resetSearch();
      });
    } else {
      this.errorMessage.emit('Select city from the autocomplete suggestions');
    }
  }

  resetSearch() {
    this.searchComplete = false;
    this.city = '';
    this.state = '';
    this.country = '';
    this.autocomplete = null;
    this.searchForm.reset();
  }

  toggleEnterToSubmit(event) {
    if (!this.searchComplete) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  // Some cities have county, city, state, country variables and
  // some have only city, state, country. The else if takes care of that.
  parseAutocompleteData(address) {
    if (address.length === 4) {
      this.searchComplete = true;
      this.city = address['0'].long_name;
      this.state = address['2'].long_name;
      this.country = address['3'].long_name;
    } else if (address.length === 3) {
      this.searchComplete = true;
      this.city = address['0'].long_name;
      this.state = address['1'].long_name;
      this.country = address['2'].long_name;
    } else {
      this.searchComplete = false;
    }
  }

  createForm() {
    this.searchForm = this.fb.group({
      location: ['']
    });
  }

}