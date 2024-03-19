import { Validators } from '@angular/forms';

export const emailValidator = Validators.pattern(
  `^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$`
);

export const passwordValidator = Validators.pattern(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,24}$'
);
