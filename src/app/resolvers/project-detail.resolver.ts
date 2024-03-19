import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProjectService } from '../services/project.service';

export const projectDetailResolver: ResolveFn<Promise<any>> = async (
  route,
  state
) => {
  const projectService = inject(ProjectService);
  const projectId = route.paramMap.get('projectId');
  try {
    return await projectService.getProject(Number(projectId));
  } catch (err) {
    return err;
  }
};
