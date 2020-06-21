import { Injectable } from '@angular/core';
import { Country } from '../models/country.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { WorkLocation } from '../models/work-location.model';
import { map, tap } from 'rxjs/operators';



interface Admin {
    email: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserAdminService {
    private adminCollection: AngularFirestoreCollection<Admin>;
    constructor(private firestore: AngularFirestore,

    ) {
    }



    getAdmins() {
        return this.firestore.collection('admins').snapshotChanges();
    }
}