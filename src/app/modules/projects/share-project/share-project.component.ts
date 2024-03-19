import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from 'src/app/models/project.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonService } from 'src/app/services/common.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { ProjectService } from 'src/app/services/project.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-share-project',
  templateUrl: './share-project.component.html',
  styleUrls: ['./share-project.component.scss'],
})
export class ShareProjectComponent implements OnInit {
  removeMdcClass: boolean = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails: string[] = [];
  isInvalidEmails = false;
  inviteLink: string;
  shareLink: string;
  isPublic = false;
  isMenuFocused = true;
  isLoading = false;
  isSharing = false;
  isOwner = false;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<ShareProjectComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      projectData: Project;
      inviteLink: string;
      shareLink: string;
      isOwner: boolean;
    },
    private announcer: LiveAnnouncer,
    public commonService: CommonService,
    private snackbar: SnackBarService,
    private sharedService: SharedService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.inviteLink = location.origin + this.data.inviteLink;
    this.shareLink = location.origin + this.data.shareLink;
    this.isPublic = this.data.projectData.isPublic;
    this.isOwner = this.data.isOwner;
  }

  addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add email
    if (
      value &&
      this.commonService.validateEmail(event.value) &&
      !this.emails.includes(value)
    ) {
      this.emails.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  removeEmail(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);

      this.announcer.announce(`Removed ${email}`);
    }
  }

  editEmail(email: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();

    // Remove email if it no longer has a name
    if (!value) {
      this.removeEmail(email);
      return;
    }

    // Edit existing email
    const index = this.emails.indexOf(email);
    if (
      index >= 0 &&
      this.commonService.validateEmail(event.value) &&
      !this.emails.includes(value)
    ) {
      this.emails[index] = value;
    }
  }

  async onSendInvitations(): Promise<void> {
    if (this.emails.length <= 0) {
      this.isInvalidEmails = true;
      return;
    }
    this.isLoading = true;
    this.isInvalidEmails = false;
    try {
      const payload = {
        projectId: this.data.projectData.id,
        email: this.emails,
        isInvite: this.isSharing ? false : true,
        link: this.isSharing ? this.shareLink : this.inviteLink,
      };
      const response = await this.projectService.sendInviteEmail(payload);
      if (response && response.success && response.data) {
        this.snackbar.success(SuccessConstant.INVITE_SENT);
        this.dialogRef.close(this.isPublic);
        this.sharedService.setIsProjectTeamChanged(true);
      }
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
    }
  }

  copyLink(value: string): void {
    if (value && value.trim()) {
      navigator.clipboard.writeText(value.toString());
      this.snackbar.success(SuccessConstant.COPIED);
    }
  }

  async onUpdatePrivacyStatus(
    projectId: number,
    isPublic: boolean
  ): Promise<void> {
    if (this.isPublic === isPublic) return;
    this.isLoading = true;
    try {
      const payload = {
        projectId,
        isPublic,
      };
      const response = await this.projectService.addUpdatePrivacyStatus(
        payload
      );
      if (response && response.success && response.data) {
        this.isPublic = response.data.isPublic;
        if (!this.isPublic) {
          this.isSharing = false;
        }
      }
      this.isLoading = false;
    } catch (error) {
      this.isSharing = false;
    }
  }

  async onResetInviteLink(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.projectService.onResetInviteLink(
        this.data.projectData.id
      );
      if (response && response.success && response.data) {
        this.inviteLink = location.origin + response.data;
        this.snackbar.success(SuccessConstant.LINK_RESET);
      }
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
    }
  }
}
