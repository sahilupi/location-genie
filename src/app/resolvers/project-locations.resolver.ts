import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProjectService } from '../services/project.service';

export const projectLocationsResolver: ResolveFn<Promise<any>> = async (
  route,
  state
) => {
  const projectService = inject(ProjectService);
  const projectId = route.parent?.paramMap.get('projectId');
  try {
    return await projectService.getProjectLocations(Number(projectId));
  } catch (err) {
    return err;
  }
};
