import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-token-verification',
  templateUrl: './project-token-verification.component.html',
  styleUrls: ['./project-token-verification.component.scss'],
})
export class ProjectTokenVerificationComponent implements OnInit {
  @Input() projectId: string;
  @Input() token: string;
  constructor(private projectService: ProjectService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.onVerifyToken();
  }

  private async onVerifyToken(): Promise<void> {
    const payload = {
      projectId: Number(this.projectId),
      projectToken: this.token,
    };
    const response = await this.projectService.onAddInvitedMember(payload);
    if (response && response.success) {
      const projectId = response.data.projectId;
      this.router.navigateByUrl(`/projects/project-detail/${projectId}/team`);
    } else {
      this.router.navigateByUrl('/');
    }
    // if response is not successfull, show error msg and navigate to home page.
    // else naviagte to project details team page
  }
}
