
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot, DocumentData } from "@angular/fire/firestore";
import { Employee } from './employee.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, switchMap, map } from 'rxjs/operators';
import { isNullOrUndefined, parseFirestoreTimestamp } from '../shared/helper-functions';
import { Project } from '../shared/models/project.model';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private _employeeCollection: AngularFirestoreCollection<Employee>;

  private _initEmployee(employeeDoc: QueryDocumentSnapshot<DocumentData>) {
    const employee = employeeDoc.data() as Employee;
    employee.docId = employeeDoc.id;
    if (isNullOrUndefined(employee.lastStudy)) {
      employee.lastStudy = null;
    } else {
      const studyCompletionDate = parseFirestoreTimestamp(employee.lastStudy.completionDate);
      employee.lastStudy.completionDate = studyCompletionDate;
    }
    if (isNullOrUndefined(employee.skills)) {
      employee.skills = [];
    }
    if (isNullOrUndefined(employee.projects)) {
      employee.projects = [];
    } else {
      employee.projects = employee.projects.map(project => {
        project.initialDate = parseFirestoreTimestamp(project.initialDate);
        project.completionDate = parseFirestoreTimestamp(project.completionDate);
        return project;
      });
    }
    return employee;
  }

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {
    this._employeeCollection = this.firestore.collection<Employee>('employees');
  }

  getSchools() {
    return this.firestore.collection('schools').snapshotChanges();
  }

  getSkills() {
    return this.firestore.collection('skills').snapshotChanges();
  }

  getEmployeeByUid(employeeUid: string) {
    return this.firestore.collection<Employee>('employees',
      ref => ref.where('employeeUid', '==', employeeUid).limit(1)).get().pipe(
        map(querySnap => {
          const employeeDoc = querySnap.docs[0];
          const employee = this._initEmployee(employeeDoc);
          return employee;
        })
      );
  }

  getEmployees() {
    return this._employeeCollection.get().pipe(
      map(data => data.docs.map(employeeDoc => this._initEmployee(employeeDoc)))
    );
  }

  createEmployee(employeeUid: string, employee: Employee) {
    if (employeeUid != null && employeeUid !== '') {
      return this.auth.user.pipe(
        take(1),
        switchMap(user => {
          const authorUid = user.uid;
          employee.authorUid = authorUid;
          employee.employeeUid = employeeUid;
          return from(this._employeeCollection.add(employee));
        })
      );
    }
    console.error('Can\'t create employee with invalid uid: ', employeeUid);
  }

  updateEmployeeByUid(uid: string, newEmployeeInfo: Employee) {
    return this.getEmployeeByUid(uid).pipe(
      switchMap(employee => from(this._employeeCollection.doc(employee.docId).update(newEmployeeInfo)))
    );
  }

  updateEmployeeByDocId(docId: string, newEmployeeInfo: Employee) {
    return this._employeeCollection.doc(docId).update(newEmployeeInfo);
  }

  deleteEmployee(docId: string) {
    return this._employeeCollection.doc(docId).delete();
  }

  getLoggedUserEmployeeData(): Observable<Employee> {
    return this.auth.user.pipe(
      take(1),
      switchMap(user => this.getEmployeeByUid(user.uid))
    );
  }
}
