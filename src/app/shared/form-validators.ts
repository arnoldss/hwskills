import { FormGroup, ValidationErrors } from '@angular/forms';

export class FormValidators {
  public static confirmPassword(pwdFormGroup: FormGroup): ValidationErrors {
    const password = pwdFormGroup.get('password').value;
    const pwdConfirm = pwdFormGroup.get('pwdConfirm').value;
    if (password === pwdConfirm) {
      return null;
    } else {
      return {
        passwordsNotTheSame: { message: 'Passwords don\'t match' }
      };
    }
  }
}
