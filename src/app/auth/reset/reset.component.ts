import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { emailValidator } from 'src/app/constants/patterns.constant';
import { AuthService } from 'src/app/services/auth.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss', '../login/login.component.scss'],
})
export class ResetComponent implements OnInit {
  @Output() reset = new EventEmitter<null>();
  forgetPasswordForm: FormGroup;
  isSubmitted = false;

  constructor(
    private authService: AuthService,
    private snackbar: SnackBarService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.forgetPasswordInit();
  }

  private async forgetPasswordInit() {
    this.forgetPasswordForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        emailValidator,
      ]),
    });
  }

  get c(): { [key: string]: AbstractControl } {
    return this.forgetPasswordForm.controls;
  }

  onToggle(): void {
    this.reset.emit(null);
  }

  async forgetPassword(): Promise<void> {
    if (!this.forgetPasswordForm.valid) return;
    const url = location.origin + '/reset-password';
    const email = await this.forgetPasswordForm.value.email;
    const response = await this.authService.forgetPassword(email, url);
    if (response && response.data && response.data.length > 0) {
      this.snackbar.success(response.data[0]);
      this.router.navigate(['/']);
    }
  }
}
