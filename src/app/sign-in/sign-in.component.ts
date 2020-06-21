import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  templateUrl: 'sign-in.component.html',
  styleUrls: ['sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  form: FormGroup;

  constructor(private auth: AngularFireAuth,
              private fb: FormBuilder,
              private router: Router,
              private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  signIn() {
    const username = this.form.get('username').value;
    const password = this.form.get('password').value;
    const snackbarConfig: MatSnackBarConfig = { duration: 10000 };
    this.auth.signInWithEmailAndPassword(username, password).then(
      onFulfilled => {
        this.snackbar.dismiss();
        this.router.navigate(['/employee']);
      },
      onRejected => this.snackbar.open(onRejected.message, 'Dismiss', snackbarConfig)
    );
  }
}
