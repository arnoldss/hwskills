import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from './employee.service';
import { Country } from '../shared/models/country.model';
import { ActivatedRoute } from '@angular/router';
import { Skill } from '../shared/models/skill.model';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, map, tap, take } from 'rxjs/operators';
import { Employee } from './employee.model';
import { isNullOrUndefined, parseFirestoreTimestamp } from '../shared/helper-functions';
import { Study } from '../shared/models/study.model';
import { Project } from '../shared/models/project.model';

@Component({
  selector: 'app-employee-component',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  countries: Country[];
  employee: Employee;
  studyForm: FormGroup;
  skillForm: FormGroup;
  projectForm: FormGroup;

  constructor(private auth: AngularFireAuth,
              private employeeService: EmployeeService,
              private fb: FormBuilder,
              private route: ActivatedRoute) { }

  private _initForms() {
    this.studyForm = this.fb.group({
      countryCode: [null, [Validators.required]],
      institutionName: [null, [Validators.required]],
      studyName: [null, [Validators.required]],
      completionDate: [null, [Validators.required]]
    });
    this.skillForm = this.fb.group({
      name: [null, Validators.required],
      area: [null, Validators.required]
    });
    this.projectForm = this.fb.group({
      customer: [null, Validators.required],
      initialDate: [null, Validators.required],
      completionDate: [null, Validators.required],
      role: [null, Validators.required]
    });
  }

  private _updateEmployee() {
    this.auth.user.pipe(
      take(1),
      switchMap(user => {
        const uid = user.uid;
        return this.employeeService.updateEmployeeByUid(uid, this.employee);
      })
    ).subscribe(success => {}, error => console.error(error));
  }

  ngOnInit() {
    this._initForms();
    const routeSnapshot = this.route.snapshot;
    this.countries = routeSnapshot.data.countries;
    this.employeeService.getLoggedUserEmployeeData().subscribe(
      employee => {
        const studyFormValue = employee.lastStudy != null ? {...employee.lastStudy} : {
          countryCode: null,
          institutionName: null,
          studyName: null,
          completionDate: null
        };
        this.studyForm.setValue(studyFormValue);
        this.employee = employee;
      },
      error => console.error(error)
    );
  }

  onAddSkill() {
    const newSkill: Skill = this.skillForm.value;
    const skills = [...this.employee.skills];
    skills.push(newSkill);
    this.employee.skills = skills;
    this._updateEmployee();
  }

  onProjectDelete(index: number) {
    const projects = [...this.employee.projects];
    projects.splice(index, 1);
    this.employee.projects = projects;
    this._updateEmployee();
  }

  onProjectSubmit() {
    const newProject: Project = this.projectForm.value;
    const projects = [...this.employee.projects];
    projects.push(newProject);
    this.employee.projects = projects;
    this._updateEmployee();
  }

  onSkillDelete(index: number) {
    const skills = [...this.employee.skills];
    skills.splice(index, 1);
    this.employee.skills = skills;
    this._updateEmployee();
  }

  onStudySubmit() {
    const lastStudy: Study = this.studyForm.value;
    this.employee.lastStudy = lastStudy;
    this._updateEmployee();
  }
}
