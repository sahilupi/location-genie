import { Injectable } from '@angular/core';
import { BaseResonse, Pagination } from '../models/common.model';
import { HttpService } from './http.service';
import { InviteEmail, PrivacyStatus, Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private httpService: HttpService) {}

  selectedProjectListings: number[] = [];

  async getProjects(data?: Pagination): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Project/get-all-project-by-user-id?PaginationFilter.PageNumber=${data?.pageNumber}&PaginationFilter.PageSize=${data?.pageSize}`
    );
  }

  async getProject(projectId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Project/get-project-by-id?id=${projectId}`
    );
  }

  async getInviteLink(projectId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Project/get-invite-link-by-project-id?id=${projectId}`
    );
  }

  async deleteProject(projectId: number): Promise<BaseResonse> {
    return this.httpService.delete(
      `/api/Project/delete-project-by-id?id=${projectId}`
    );
  }

  async addUpdateProject(data: Project): Promise<BaseResonse> {
    return this.httpService.post(`/api/Project/add-update-project`, data);
  }

  async addUpdatePrivacyStatus(payload: PrivacyStatus): Promise<BaseResonse> {
    return this.httpService.put(`/api/Project/update-project-status`, payload);
  }

  async sendInviteEmail(payload: InviteEmail): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Project/share-invite-team-member-by-send-email`,
      payload
    );
  }

  async onResetInviteLink(projectId: number): Promise<BaseResonse> {
    return this.httpService.put(
      `/api/Project/reset-private-invite-link-by-project-id`,
      projectId
    );
  }

  async getProjectTeam(projectId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Project/get-all-project-team-member-by-id?id=${projectId}`
    );
  }

  async onAddInvitedMember(payload: {
    projectId: number;
    projectToken: string;
  }): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Project/add-invited-team-member`,
      payload
    );
  }

  async onAddLocationToProject(payload: {
    projectId: number;
    listingId?: number;
    isSelected: boolean;
  }): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Project/add-listing-by-project-id`,
      payload
    );
  }

  async getProjectLocations(projectId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Project/get-all-project-listings-by-id?id=${projectId}`
    );
  }

  async deleteTeamMember(teamMemberId: number): Promise<BaseResonse> {
    return this.httpService.delete(
      `/api/Project/delete-project-team-member-by-id?id=${teamMemberId}`
    );
  }

  async deleteProjectLocation(locationId: number): Promise<BaseResonse> {
    return this.httpService.delete(
      `/api/Project/delete-project-listing-by-id?id=${locationId}`
    );
  }

  async onLikeDislikeProjectLocation(payload: {
    projectListingId: number;
    isLike: boolean;
  }): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Project/like-dislike-project-listing-by-id`,
      payload
    );
  }

  async onAddComment(payload: {
    projectListingId: number;
    comment: string;
  }): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Project/add-project-listing-comment`,
      payload
    );
  }

  async onUpdateProjectLocationStatus(payload: {
    id: number;
    projectListingStatus: number;
  }): Promise<BaseResonse> {
    return this.httpService.put(
      `/api/Project/update-project-listing-status`,
      payload
    );
  }

  async getAllSelectedProjectLocations(): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Project/get-all-selected-project-listing-by-user-id`
    );
  }

  async onCopyProject(payload: {
    listingId: number;
    projectIds: number[];
  }): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Project/copy-project-listing-in-another-project`,
      payload
    );
  }
}
