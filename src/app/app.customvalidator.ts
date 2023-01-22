import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

export const equalsValidation: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get("pass")
    const confirmarPassword = control.get("passC")
    return password.value === confirmarPassword.value ? null : { noSonIguales: true }
}