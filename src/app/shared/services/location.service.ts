import { Injectable } from '@angular/core';
import { Country } from '../models/country.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { WorkLocation } from '../models/work-location.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private _countries: Country[] = [];
  private _workLocations: WorkLocation[] = [];
  private _countryCollection: AngularFirestoreCollection<Country>;
  private _workLocCollection: AngularFirestoreCollection<WorkLocation>;

  constructor(private firestore: AngularFirestore) {
    this._countryCollection = this.firestore
      .collection<Country>('countries', ref => ref.orderBy('name', 'asc'));
    this._workLocCollection = this.firestore.collection<WorkLocation>('workLocations');
  }

  get countries(): Country[] {
    return [...this._countries];
  }

  get workLocations(): WorkLocation[] {
    return [...this._workLocations];
  }

  getCountries() {
    return this._countryCollection.get().pipe(
      map(data => data.docs.map(doc => doc.data() as Country)),
      tap(countries => this._countries = countries),
    );
  }

  getWorkLocations() {
    return this._workLocCollection.get().pipe(
      map(data => data.docs.map(doc => doc.data() as WorkLocation)),
      tap(workLocations => this._workLocations = workLocations)
    );
  }
}
