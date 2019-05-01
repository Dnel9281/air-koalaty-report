import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  aqi: object;
  errorMessage: string;
  loading: boolean;
  firstSearchInitiated: boolean;

  constructor() {}

  ngOnInit() {
    this.firstSearchInitiated = false;
    this.loading = false;
  }

  onFirstSearchInitiated(firstSearchInitiated: boolean) { this.firstSearchInitiated = firstSearchInitiated }
  onLoading(loading: boolean) { this.loading = loading }
  onAqi(aqi: object) { this.aqi = aqi }
  onErrorMessage(errorMessage: string) { this.errorMessage = errorMessage }
}

