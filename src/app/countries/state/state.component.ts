import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AqiService } from '../../services/aqi/aqi.service';
import { Cities } from '../../services/aqi/cities';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
  country: any;
  state: any;
  loading: boolean;
  errorMessage: string;
  cities: Cities;
  
  constructor(private route: ActivatedRoute, private aqiService: AqiService) { }

  ngOnInit() {
    let params = this.route.snapshot.params;
    this.country = params['country'];
    this.state = params['state'];
    this.loading = true;
    this.aqiService.getCities(this.state, this.country).subscribe(res => {
      this.loading = false;
      this.cities = res
    },
    err => {
      this.loading = false;
      this.errorMessage = err.error.message;
    });
  }

}
