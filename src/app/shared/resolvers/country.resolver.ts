import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Country } from '../models/country.model';
import { LocationService } from '../services/location.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryResolver implements Resolve<Country[]> {
  constructor(private locationServ: LocationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Country[]> | Promise <Country[]> | Country[] {
    const servCountryList = this.locationServ.countries;
    const isCountryListEmpty = servCountryList.length <= 0;
    if (isCountryListEmpty) {
      return this.locationServ.getCountries();
    } else {
      return servCountryList;
    }
  }
}
