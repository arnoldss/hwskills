import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { WorkLocation } from '../models/work-location.model';
import { Observable } from 'rxjs';
import { LocationService } from '../services/location.service';

@Injectable({
  providedIn: 'root'
})
export class WorkLocationResolver implements Resolve<WorkLocation[]> {
  constructor(private locationServ: LocationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  : Observable<WorkLocation[]> | Promise<WorkLocation[]> | WorkLocation[] {
    const servWorkLocationsList = this.locationServ.workLocations;
    const isWorkLocationsEmpty = servWorkLocationsList.length <= 0;
    if (isWorkLocationsEmpty) {
      return this.locationServ.getWorkLocations();
    } else {
      return servWorkLocationsList;
    }
  }
}
