import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorConstant } from 'src/app/constants/error.constant';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {
  text: string = 'Please Wait...';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private personalInfoService: PersonalInfoService,
    private snackbar: SnackBarService
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async (params) => {
      const userId = params['userId'];
      const token = params['token'];
      await this.verifyEmail(userId, token);
    });
  }

  async verifyEmail(userId: string, token: string): Promise<void> {
    const response = await this.personalInfoService.verifyEmail(userId, token);
    if (
      response &&
      response.success &&
      response.data &&
      response.data.length > 0
    ) {
      this.snackbar.success(response.data[0]);
      this.router.navigate(['/']);
    } else {
      this.text = 'Invalid or expired token';
      this.router.navigate(['/']);
    }
  }
}
