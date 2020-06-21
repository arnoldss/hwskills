import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { UserAdminService } from '../shared/services/admin.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: Observable<User>;
  isAdmin = false;

  constructor(private auth: AngularFireAuth,
              private router: Router,
              private admin: UserAdminService) { }

  ngOnInit() {
    this.user = this.auth.user;
    this.auth.authState.subscribe(user => {
      if (user != null) {
        this.admin.getAdmins().subscribe((a) => {
          a.forEach((a: any) => {
            if (a.payload.doc.data().email === user.email) {
              this.isAdmin = true
            }
          })
        })
      } else {
        this.isAdmin = false;
      }
    });
  }

  signOut() {
    this.auth.signOut().then(
      onFulfilled => this.router.navigate(['/sign-in'])
    );
  }
}
