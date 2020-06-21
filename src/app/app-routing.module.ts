import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { EmployeeComponent } from './employee/employee.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RegisterComponent } from './register/register.component';
import { CountryResolver } from './shared/resolvers/country.resolver';
import { WorkLocationResolver } from './shared/resolvers/work-location.resolver';
import { AdminComponent } from './admin/admin.component';


const redirectUnauthenticatedToSignIn = () => redirectUnauthorizedTo(['/sign-in']);

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AngularFireAuthGuard] ,
    data: { authGuardPipe: redirectUnauthenticatedToSignIn },
    resolve: {
      countries: CountryResolver,
      workLocations: WorkLocationResolver
    }
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    canActivate: [AngularFireAuthGuard] ,
    data: { authGuardPipe: redirectUnauthenticatedToSignIn },
    resolve: {
      countries: CountryResolver,
      workLocations: WorkLocationResolver
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    resolve: { countries: CountryResolver, workLocations: WorkLocationResolver } },
  { path: 'register', component: RegisterComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: '**', redirectTo: '/sign-in' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
