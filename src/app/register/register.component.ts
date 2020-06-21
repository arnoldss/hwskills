import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Country } from '../shared/models/country.model';
import { WorkLocation } from '../shared/models/work-location.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormValidators } from '../shared/form-validators';
import { Employee } from '../employee/employee.model';
import { EmployeeService } from '../employee/employee.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})
export class RegisterComponent implements OnInit {
  countries: Country[];
  form: FormGroup;
  employeeFormGroup: FormGroup;
  workLocations: WorkLocation[];

  constructor(private auth: AngularFireAuth,
              private fb: FormBuilder,
              private employeeServ: EmployeeService,
              private route: ActivatedRoute,
              private router: Router) { }

  private initFormGroups() {
    this.form = this.fb.group({
      employee: this.fb.group({
        idEmployee: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        livingCity: [null, [Validators.required]],
        livingCountry: [null, [Validators.required]],
        mainRole: [null, [Validators.required]],
        name: [null, [Validators.required]],
        workLocation: [null, [Validators.required]],
      }),
      pwdData: this.fb.group({
        password: [null, [Validators.required, Validators.minLength(6)]],
        pwdConfirm: [null, [Validators.required]]
      }, { validators: [FormValidators.confirmPassword] })
    });
    this.employeeFormGroup = this.form.get('employee') as FormGroup;
    this.employeeFormGroup.get('livingCountry').valueChanges.subscribe(
      (value: string) => this.employeeFormGroup.get('workLocation').reset()
    );
  }

  ngOnInit() {
    this.initFormGroups();
    this.countries = this.route.snapshot.data.countries;
    this.workLocations = this.route.snapshot.data.workLocations;
  }

  getWorkLocations(countryCode: string): WorkLocation[] {
    return this.workLocations.filter(location => location.countryCode === countryCode);
  }

  onSubmit() {
    const email = this.employeeFormGroup.get('email').value;
    const password = this.form.get('pwdData').get('password').value;
    const employee: Employee = this.employeeFormGroup.value;
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(
        onFulfilled => {
          const employeeId = onFulfilled.user.uid;
          this.auth.signInWithEmailAndPassword(email, password)
            .then(
              userData => {
                this.employeeServ.createEmployee(employeeId, employee).subscribe(
                  docRef => this.router.navigate(['/employee']),
                  err => console.error(err)
                );
              },
              error => console.error(error)
            );
        },
        onReject => console.error(onReject)
      );
  }
}
