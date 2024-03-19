import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProjectService } from '../services/project.service';

export const projectResolver: ResolveFn<Promise<any>> = async (
  route,
  state
) => {
  const projectService = inject(ProjectService);
  try {
    return await projectService.getProjects();
  } catch (err) {
    return err;
  }
};
